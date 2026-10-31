# Zenodo deposit: Between the Rounds, v1.0

Status: prepared locally; no Zenodo draft or DOI has been created.
The license is awaiting the author's selection and is deliberately absent from
`metadata.json`. It must be supplied before the record is published.

Upload both language editions in one record:

- [`whitepaper-en.pdf`](../whitepaper-en.pdf)
- [`whitepaper-pt.pdf`](../whitepaper-pt.pdf)

`metadata.json` contains the prepared deposit metadata. `files.json` records
the sizes and SHA-256 checksums of the reviewed PDF files. Only the two PDFs
are intended as the uploaded research files; these preparation files are not
part of the paper.

## Publish through the website

1. Sign in at <https://zenodo.org/uploads/new>.
2. Upload the two PDFs and use **Publication → Working paper** as the type.
3. Copy the title, author, abstract, keywords, date and version from
   `metadata.json`. Confirm the author name and choose the intended license.
4. Answer **No** to the existing DOI question, then **Get a DOI now!** to reserve
   a DOI. If the paper already has a DOI, use that existing DOI instead.
5. Preview and publish the record. The reserved DOI becomes registered when
   the record is published.
6. Add the published DOI as the `doi` field on the whitepaper entry in
   `content/writing/publications.json`, then rebuild the website. Both language
   editions should link to the same bilingual record.

## Automated upload access

An API upload requires a Zenodo personal access token from
<https://zenodo.org/account/settings/applications/> with `deposit:write` and
`deposit:actions`. Store it as `ZENODO_ACCESS_TOKEN` in the project's ignored
`.env` file. Do not place the token in this directory, Git, or chat.

Documentation:

- <https://help.zenodo.org/docs/deposit/create-new-upload/>
- <https://help.zenodo.org/docs/deposit/describe-records/reserve-doi/>
- <https://developers.zenodo.org/>
