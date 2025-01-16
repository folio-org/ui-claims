## Shared/Common
* [x] Uses Apache 2.0 license
* [x] Module build MUST produce a valid module descriptor
* [x] Module descriptor MUST include interface requirements for all consumed APIs
* [x] Third party dependencies use an Apache 2.0 compatible license
* [x] Installation documentation is included
  * -_note: nothing specific for UI module
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
  * -_note: not required for FE
* [x] Sensitive and environment-specific information is not checked into git repository
* [x] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
* [x] Must not depend on a FOLIO library that has not been approved through the TCR process
* [x] Module gracefully handles the absence of third party systems or related configuration
* [x] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools
* [x] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)

## Frontend
* [ ] If provided, End-to-end tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * - note: AQA have other priorities as for now :( 
* [x] Have i18n support via react-intl and an `en.json` file with English texts
* [x] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
* [x] Use the latest release of Stripes at the time of evaluation
* [x] Follow relevant existing UI layouts, patterns and norms
* [x] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation
