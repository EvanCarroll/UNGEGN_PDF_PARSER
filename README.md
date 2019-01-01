United Nations Group of Experts on Geographical Names (UN GEGN) (UNGEGN)
===

This is a failed attempt at parsing the [E/CONF.105/13](https://unstats.un.org/unsd/geoinfo/UNGEGN/docs/11th-uncsgn-docs/E_Conf.105_13_CRP.13_15_UNGEGN%20WG%20Country%20Names%20Document.pdf). First I migrated the pdf to text to text with `pdftotext -layout`. I proceeded to do minimal processing on the PDF with vim. Then I thought I could right a parser on it to get it into a database.

This effort was abandon because the Unicode formatting is very poor, and some of it lacks Unicode entirely; some of it is just text-pictures. This throws off the parser (a problem I may be able to fix and Q/A), but renders the text in the screen shot impossible.

* Sri Lanka, Myanmar and Comoros are examples of screen-shot text.
* Albania / Shqipëri has no text for the first language, and the "short name is actually the language itself"
* All of the names are in ASCII with the exception of the "CÔTE D’IVOIRE"
* There is no way to tell if a column extends down a row, which column it was the first or second.. All we know it that only one column extended down so the other column is empty.

You can find more information here,

		* https://opendata.stackexchange.com/questions/13693/does-the-ungegn-release-their-country-names-localized-in-a-format-thats-not-a-p
		* https://opendata.stackexchange.com/questions/13692/where-does-iso-3166-get-the-names-and-translations-of-the-countries
		* https://dba.stackexchange.com/questions/225996/unicode-storage-of-u202b-rle-and-u202c-pde-in-a-unicode-aware-database
		* [UNGEGN](https://unstats.un.org/unsd/geoinfo/UNGEGN/)
		* [Working Group on Country Names](https://unstats.un.org/unsd/geoinfo/UNGEGN/wg1.html)
