var env;
var base_uri = "http://schemas.opengis.net/";
var version = "1.0";

function setup() {
	$.ajaxSetup({'beforeSend': function(xhr){
		if (xhr.overrideMimeType)
			xhr.overrideMimeType("text/plain");
		}
	});
		
	env = require('JSV/lib/jsv').JSV.createEnvironment("json-schema-draft-03");
};

function addSchema(service, resource) {
	var schema_path = service+"/"+version+"/"+resource+".json";
	test("Register Schema "+schema_path, function () {	
		$.ajax({
			url: "schemas/"+schema_path,
			async: false,
			dataType: 'json',
			error: function(jqXHR, textStatus, errorThrown) {
				ok(null, "Schema file: "+url+". Error: "+textStatus+", "+errorThrown);
			},
			success: function(schema) {
				// console.log(schema);
				env.createSchema(schema, null, base_uri+schema_path); 
			}
		});
		ok(env.findSchema(base_uri+schema_path),base_uri+schema_path+" added");		
	});
};


function validateExample( service, resource, example, service_example ) {
	var schema_uri = base_uri+service+"/"+version+"/"+resource+".json";
	if (service_example) {
		var example_file = service_example+"/"+version+"/examples/"+example+".json";
	} else {
		var example_file = service+"/"+version+"/examples/"+example+".json";
	}
	test("Validate Example "+example_file, function () {	
        var schema = env.findSchema(schema_uri);
        ok(schema, "Schema: "+schema_uri);

		$.ajax({
			url: "schemas/"+example_file,
			async: false,
			dataType: 'json',
			error: function(jqXHR, textStatus, errorThrown) {
				ok(null, "Example file: "+example_file+". Error: "+textStatus+", "+errorThrown);
			},
			success: function(data) {
		        ok(data, "Example file: "+example_file);
				var report = env.validate(data,schema);
				equal(report.errors.length, 0, "example valid");
				if (report.errors.length>0) {
					console.log(report.errors);
				};
			}
		});
	});
};

function validateSchema( service, resource ) {
	var schema_uri = base_uri+service+"/"+version+"/"+resource+".json";
	test("Validate Schema "+schema_uri, function () {	
        var schema = env.findSchema(schema_uri);
        ok(schema, "Schema: "+schema_uri);
		
		var jsonschema = env.findSchema(env.getOption("latestJSONSchemaSchemaURI"));
		var report = jsonschema.validate(schema); 
		equal(report.errors.length, 0, 'schema valid');
		if (report.errors.length>0) {
			console.log(report.errors);
		};
	});
};

function validateDictionary( service, resource, dict ) {
	var schema_uri = base_uri+service+"/"+version+"/"+resource+".json";
	var dict_file = service+"/"+version+"/"+dict+".json";
	test("Validate Dictionary "+dict_file, function () {	
        var schema = env.findSchema(schema_uri);
        ok(schema, "Schema: "+schema_uri);

		$.ajax({
			url: "schemas/"+dict_file,
			async: false,
			dataType: 'json',
			error: function(jqXHR, textStatus, errorThrown) {
				ok(null, "Dictionary file: "+dict_file+". Error: "+textStatus+", "+errorThrown);
			},
			success: function(data) {
		        ok(data, "Dictionary file: "+dict_file);
				var report = env.validate(data,schema);
				equal(report.errors.length, 0, "dictionary valid");
				if (report.errors.length>0) {
					console.log(report.errors);
				};
			}
		});
	});
};


function validate( service, resource, example, service_example ) {
	if (service_example) {
		validateExample(service,resource,example,service_example);
	} else if (example) {
		validateExample(service,resource,example);
	} else {
		addSchema(service,resource);
		validateSchema(service,resource);
		validateExample(service,resource,resource);
	}
}

// Tests

module("Setup");
setup();

module("http://www.opengis.net/spec/gsr/1.0/req/core (Core)");
addSchema( "gsr", "error" );
validate( "gsr", "exception" );

module("http://www.opengis.net/spec/gsr/1.0/req/geometry (Core - Geometry)");
validate( "gsr", "spatialreference" );
validate( "gsr", "spatialreference", "spatialreference_wkt" );
addSchema( "gsr", "spatialreferences" );
validateDictionary( "gsr", "spatialreferences", "sr" );
addSchema( "gsr", "units" );
validateDictionary( "gsr", "units", "lengthUnits" );
validateDictionary( "gsr", "units", "areaUnits" );
validateDictionary( "gsr", "units", "srLengthUnits" );
addSchema( "gsr", "geometry" );
addSchema( "gsr", "singleGeometry" );
validate( "gsr", "point" );
validate( "gsr", "multipoint" );
validate( "gsr", "polyline" );
validate( "gsr", "polygon" );
validate( "gsr", "envelope" );
validate( "gsr", "geometries" );

module("http://www.opengis.net/spec/gsr/1.0/req/feature (Core - Features)");
addSchema( "gsr", "keyValuePairs" );
addSchema( "gsr", "attributes" );
validate( "gsr", "feature" );
validate( "gsr", "features" );
addSchema( "gsr", "field" );
addSchema( "gsr", "fields" );
addSchema( "gsr", "template" );
addSchema( "gsr", "domain" );
addSchema( "gsr", "renderer" );
validate( "gsr", "layerOrTable" );
validate( "gsr", "layerOrTable", "layerOrTable_featureservice" );
validate( "gsr", "singleFeature" );
validate( "gsr", "featureSet" );
validate( "gsr", "featureSet", "featureSet_GPRecordSet" );
validate( "gsr", "featureSet", "featureSet_GPFeatureRecordSet" );
validate( "gsr", "featureIdSet" );
validate( "gsr", "featureIdSet", "featureIdSet_featureservice" );
validate( "gsr", "relatedRecords" );
validate( "gsr", "relatedRecords", "relatedRecords_featureservice" );
validate( "gsr", "attachmentInfos" );
validate( "gsr", "htmlPopup" );

module("http://www.opengis.net/spec/gsr/1.0/req/renderer (Renderer)");
validate( "gsr", "rangeDomain" );
validate( "gsr", "codedValueDomain" );
validate( "gsr", "inheritedDomain" );
validate( "gsr", "color" );
addSchema( "gsr", "marker" );
validate( "gsr", "sms" );
validate( "gsr", "sls" );
validate( "gsr", "sfs" );
validate( "gsr", "pms" );
validate( "gsr", "pfs" );
addSchema( "gsr", "font" );
validate( "gsr", "ts" );
validate( "gsr", "label" );
validate( "gsr", "labelInfo" );
validate( "gsr", "simpleRenderer" );
validate( "gsr", "uniqueValueRenderer" );
validate( "gsr", "classBreaksRenderer" );


module("http://www.opengis.net/spec/gsr-cs/1.0/req/catalog (Catalog Service Core)");
validate( "gsr-cs", "catalog" );

module("http://www.opengis.net/spec/gsr-ms/1.0/req/mapservice (Map Service Core)");
validate( "gsr-ms", "root" );
validate( "gsr-ms", "map" );
validate( "gsr-ms", "allLayersAndTables" );

module("http://www.opengis.net/spec/gsr-ms/1.0/req/convert (Export Map with support for coordinate transformation)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/time (Export Map with support for time)");
validate( "gsr-ms", "layerTimeOptions" );

module("http://www.opengis.net/spec/gsr-ms/1.0/req/filter (Export Map with support for feature filtering)");
validate( "gsr-ms", "layerDefs" );

module("http://www.opengis.net/spec/gsr-ms/1.0/req/tile (Map Tile)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/identify (Query/Identify)");
validate( "gsr-ms", "identifiedFeatures" );

module("http://www.opengis.net/spec/gsr-ms/1.0/req/identify-convert (Identify with support for coordinate transformation)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/identify-time (Identify with support for time)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/identify-filter (Identify with support for feature filtering)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/data (Data/Feature)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/find (Find)");
validate( "gsr-ms", "identifiedFeatures", "find" );

module("http://www.opengis.net/spec/gsr-ms/1.0/req/find-convert (Find with support for coordinate transformation)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/find-filter (Find with support for feature filtering)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/query (Query)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/querytime (Temporal Query)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/queryrel (Query Related Records)");

module("http://www.opengis.net/spec/gsr-ms/1.0/req/attachements (Attachments and HTML Popups)");

module("http://www.opengis.net/spec/gsr-fs/1.0/req/featureservice (Feature Service Core)");
validate( "gsr-fs", "root" );

module("http://www.opengis.net/spec/gsr-fs/1.0/req/query (Query)");

module("http://www.opengis.net/spec/gsr-fs/1.0/req/queryTemporal (Temporal Query)");

module("http://www.opengis.net/spec/gsr-fs/1.0/req/queryRelated (Query Related Records)");

module("http://www.opengis.net/spec/gsr-fs/1.0/req/editing (Feature Editing)");
addSchema( "gsr-fs", "editResult" );
addSchema( "gsr-fs", "editResultArray" );
validate( "gsr-fs", "addResults" );
validate( "gsr-fs", "updateResults" );
validate( "gsr-fs", "deleteResults" );
validate( "gsr-fs", "editResults" );

module("http://www.opengis.net/spec/gsr-fs/1.0/req/attachements (Attachements and HTML Popups)");
validate( "gsr-fs", "addAttResult" );
validate( "gsr-fs", "addAttResult", "addAttResult_error" );
validate( "gsr-fs", "updAttResult" );
validate( "gsr-fs", "delAttResults" );

module("http://www.opengis.net/spec/gsr-fs/1.0/req/templates (Editing Templates)");

module("http://www.opengis.net/spec/gsr-gps/1.0/req/gpservice (Geoprocessing Service Core)");
validate( "gsr-gps", "root" );
addSchema( "gsr-gps", "parameter" );
validate( "gsr-gps", "task" );
validate( "gsr-gps", "linearUnit" );
validate( "gsr-gps", "url" );
validate( "gsr-gps", "url", "url_raster" );
addSchema( "gsr-gps", "parameterValue" );
addSchema( "gsr-gps", "messages" );
validate( "gsr-gps", "results" );
validate( "gsr-gps", "job" );
validate( "gsr-gps", "parameterValue", "parameterValue_mapImage" );
validate( "gsr-gps", "parameterValue", "parameterValue_multiValueString" );
validate( "gsr-gps", "parameterValue", "parameterValue_rasterDataLayer" );
validate( "gsr-gps", "parameterValue", "parameterValue_rasterData" );
validate( "gsr-gps", "parameterValue", "parameterValue_dataFile" );
validate( "gsr-gps", "parameterValue", "parameterValue_recordSet" );
validate( "gsr-gps", "parameterValue", "parameterValue_featureRecordSet" );
validate( "gsr-gps", "parameterValue", "parameterValue_linearUnit" );
validate( "gsr-gps", "parameterValue", "parameterValue_date" );
validate( "gsr-gps", "parameterValue", "parameterValue_long" );
validate( "gsr-gps", "parameterValue", "parameterValue_string" );
validate( "gsr-gps", "parameterValue", "parameterValue_boolean" );
validate( "gsr-gps", "parameterValue", "parameterValue_double" );

module("http://www.opengis.net/spec/gsr-gcs/1.0/req/gcservice (Geocoding Service Core)");
addSchema( "gsr-gcs", "addressField" );
addSchema( "gsr", "keyValuePairs" );
validate( "gsr-gcs", "root" );
addSchema( "gsr-gcs", "addressCandidate" );
validate( "gsr-gcs", "addresses" );
validate( "gsr-gcs", "address" );

module("http://www.opengis.net/spec/gsr-gs/1.0/req/geometryservice (Geometry Service Core)");
validate( "gsr-gs", "root" );
validate( "gsr-gs", "root", "root2" );
validate( "gsr-gs", "url" );
validate( "gsr", "geometries", "project", "gsr-gs" );
validate( "gsr", "geometries", "simplify", "gsr-gs" );
validate( "gsr", "geometries", "buffer", "gsr-gs" );
validate( "gsr-gs", "areasAndLengths" );
validate( "gsr-gs", "lengths" );
validate( "gsr-gs", "relation" );
validate( "gsr-gs", "labelPoints" );
validate( "gsr-gs", "distance" );
validate( "gsr", "geometries", "densify", "gsr-gs" );
validate( "gsr", "geometries", "generalize", "gsr-gs" );
validate( "gsr", "singleGeometry", "convexHull", "gsr-gs" );
validate( "gsr", "geometries", "offset", "gsr-gs" );
validate( "gsr", "geometries", "trimExtend", "gsr-gs" );
validate( "gsr", "geometries", "autoComplete", "gsr-gs" );
validate( "gsr-gs", "cut" );
validate( "gsr", "geometries", "difference", "gsr-gs" );
validate( "gsr", "geometries", "intersect", "gsr-gs" );
validate( "gsr", "singleGeometry", "reshape", "gsr-gs" );
validate( "gsr", "singleGeometry", "union", "gsr-gs" );

module("http://www.opengis.net/spec/gsr-is/1.0/req/imageservice (Image Service Core)");
validate( "gsr-is", "root" );
validate( "gsr-is", "mosaicRule" );
validate( "gsr-is", "mosaicRule", "mosaicRule2" );
addSchema( "gsr-is", "renderingRule" );
validate( "gsr-is", "renderingRule", "rasterFunctionAspect" );
validate( "gsr-is", "renderingRule", "rasterFunctionColormap" );
validate( "gsr-is", "renderingRule", "rasterFunctionColormap2" );
validate( "gsr-is", "renderingRule", "rasterFunctionHillshade" );
validate( "gsr-is", "renderingRule", "rasterFunctionNDVI" );
validate( "gsr-is", "renderingRule", "rasterFunctionShadedRelief" );
validate( "gsr-is", "renderingRule", "rasterFunctionSlope" );
validate( "gsr-is", "renderingRule", "rasterFunctionStatistics" );
validate( "gsr-is", "renderingRule", "rasterFunctionStretch" );
validate( "gsr-is", "image" );
validate( "gsr-is", "image", "image2" );
validate( "gsr-is", "identifiedItems" );
validate( "gsr-is", "identifiedItems", "identifiedItems2" );
validate( "gsr", "featureSet", "query", "gsr-is" );
validate( "gsr", "featureIdSet", "query2", "gsr-is" );
validate( "gsr", "feature", "rasterCatalogItem", "gsr-is" );
validate( "gsr-is", "image", "image3" );
validate( "gsr-is", "rasterInfo" );
validate( "gsr-is", "rasterFiles" );
