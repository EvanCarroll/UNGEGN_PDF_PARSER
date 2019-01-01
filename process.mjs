import fs from 'fs';
import * as R from 'ramda';
import readline from 'readline';

const fn = "./E_Conf.105_13_CRP.13_15_UNGEGN WG Country Names Document.txt";


const PARSER_STATE_NATIONAL  = Symbol('P_NAT');
const PARSER_STATE_UN        = Symbol('P_UN');
const PARSER_STATE_NOTES     = Symbol('P_NOTE');
const PARSER_STATE_UNDEFINED = Symbol('P_UNDEF');
const PARSER_STATE_HEADER    = Symbol('P_HEADER');

let PARSER_STATE = PARSER_STATE_UNDEFINED;

(async function () {
  const fileStream = fs.createReadStream(fn);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

	let db = [], cur;
  for await (const line of rl) {
		// Thanks: "CÔTE D’IVOIRE" forgot to ascii-ize this one.
		if ( /^[A-Z]{2}\s+[A-Z\-,()' Ô’]+$/.test(line) ) {
			PARSER_STATE = PARSER_STATE_HEADER;
			if ( cur !== undefined ) {
				db.push(cur)
			}
			var [,code,name] = line.match(/^([A-Z]{2})\s+([A-Z\-,()' Ô’]*)/);
			cur = {
				'name': name,
				'iso3166': code,
				'lang_national': [],
				'lang_un': []
			};
		}
		else {
		
			if ( /^\s*National\s+Official\s*$/.test(line) ) {
				PARSER_STATE = PARSER_STATE_NATIONAL;
				continue;
			}
			else if ( /^\s*UN\s+Official$/.test(line) ) {
				PARSER_STATE = PARSER_STATE_UN;
				continue;
			}
			else if ( /^\s*Notes\s*/.test(line) ) {
				PARSER_STATE = PARSER_STATE_NOTES;
				if ( /\t/.test(line) ) {
					let [,...content] = line.split("\t");
					cur.note = content;
				}
				continue;
			}
			else if ( /^\s*Language\s*Short name\s*Formal name\s*$/.test(line) ) {
			}
			else {
				if ( /\t/.test(line) ) {
					switch ( (line.match(/\t/g)||[]).length ) {
						case 1:
							let [x1,x2] = line.trim().split(/\t/);
							if ( x1 === 'Notes' ) {
								cur.notes = x2;
							}
							else if ( PARSER_STATE === PARSER_STATE_NATIONAL ) {
								//console.log( cur, cur_name, x1,x2);
								try {
									R.last(cur.lang_national).short += x1;
								}
								catch (err) { console.log(PARSER_STATE,cur, line) }
							}
							else if ( PARSER_STATE === PARSER_STATE_UN ) {
								//console.log( cur, cur_name, x1,x2);
							}
							else {
								console.log( PARSER_STATE, cur_name, line );
								throw new Error( "Unhandled case (one-tab)" );
							}
							break;
						case 2:
							let [code,short,formal] = line.trim().split(/\t/);
							code = toAlpha6392(code);
							if ( PARSER_STATE === PARSER_STATE_NATIONAL ) {
								cur.lang_national.push({code, short, formal});
								// console.log(
								// 	PARSER_STATE, cur_name,
								// 	toAlpha6392(code), short, formal
								// );
							}
							else if ( PARSER_STATE === PARSER_STATE_UN ) {
								cur.code = { code, short, formal };
								cur.lang_un.push({code, short, formal});
								// console.log(
								// 	PARSER_STATE, cur_name,
								// 	toAlpha6392(code), short, formal
								// );
							}
							else {
								throw new Error( "Unhandled case (one-tab)" );
							}
							break;
						case 3:
							throw new Error(`Too many tabs for line:\n\t"${line}"`);
							break;
						default:
							throw new Error('Too many tabs');
					}
				}
			}

		}
    // Each line in input.txt will be successively available here as `line`.
  }
	//console.log(db);
})();

const toAlpha6392 = str => {
	if ( /^\s*[a-z]{2}:/.test(str) ) {
		let alpha6392 = str.match(/^\s*([a-z]{2}):/)[1];
		return alpha6392;
	}
	switch(str) {
		case 'English':          return 'eng';
		case 'French':           return 'fra';
		case 'Spanish':          return 'spa';
		case 'Russian':          return 'rus';
		case 'Chinese':          return 'zho';
		case 'Arabic':           return 'ara';
		case 'Tuvaluan':         return 'tvl';
		case 'Tetum':            return 'tet';
		case 'Pedi':             return 'nso';
		case 'Creole (Seselwa)': return 'crs';
		case 'Dari':             return 'prs';
		case 'Gilbertese':       return 'gil';
		case 'Iv: Latvian':      return 'lvs';
		case 'It: Lithuanian':   return 'lit';
		case 'Palauan':          return 'pau';
		case '(Tok Pisin)':      return 'tpi';

		// There are other ISO 693-3 languages for Shikomor
		// https://en.wikipedia.org/wiki/Comorian_language
		case 'Shikomor':         return 'swb';
		default: throw new Error(`toAlpha6392 failed on '${str}'`);
	}
};
