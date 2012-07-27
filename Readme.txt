Geoservices REST API - JSON Schema documents and examples 

DRAFT 5, 22.06.2012

- The schemas folder contains the JSON Schema files and JSON examples in the folder structure currently used in the documents and which assumes that the folders "gsr", "gsr-ms", etc will be put on schemas.opengis.net.
- tests.js runs tests to validate all JSON Schema files against the current JSON Schema draft as well as all JSON examples used in the documents against the relevant JSON Schema.
- To run tests.js, open tests.html in a browser, it should load and validate all schemas and examples. It has been tested with Firefox and Safari on OS X and IE on Windows. Note that it does not work with Chrome as Chrome prohibits access to local files from JavaScript (at least unless it is started with a specific command line option).
