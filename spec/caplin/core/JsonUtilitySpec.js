describe('JsonUtility', function() {

	it('should convert JSON to XML', function() {
		var testCases = [],
			currentTestCase;

		// arbitrary JSON
		testCases.push({
			obj: {
				test: {
					prop: 'abc'
				}
			},
			resultXml: '<test><prop>abc</prop></test>'
		});

		testCases.push({
			obj: {
				test: {
					prop: 'abc',
					prop2: 'cda'
				}
			},
			resultXml: '<test><prop>abc</prop><prop2>cda</prop2></test>'
		});

		testCases.push({
			obj: {
				test: {
					prop: 'abc',
					prop2: ['a', 'b']
				}
			},
			resultXml: '<test><prop>abc</prop><prop2>a</prop2><prop2>b</prop2></test>'
		});

		testCases.push({
			obj: {
				test: {
					prop: 'abc',
					prop2: [{a: 'a'}, {a: 'b', b: 'a'}]
				}
			},
			resultXml: '<test><prop>abc</prop><prop2><a>a</a></prop2><prop2><a>b</a><b>a</b></prop2></test>'
		});

		testCases.push({
			obj: {
				test: {
					prop: 'a',
					prop2: { a: 'b', c: 'd' },
					prop3: ['a', 'b']
				}
			},
			resultXml: '<test><prop>a</prop><prop2><a>b</a><c>d</c></prop2><prop3>a</prop3><prop3>b</prop3></test>'
		});

		// JSON that gets generated from caplin.core.XmlUtility.toJson()
		testCases.push({
			obj: {
				"component": {
					"list": {
						"item": {
							"@attr1": "abc",
							"@attr2": "cde"
						}
					},
					"options": {
						"option": [
							{
								"@name": "myName",
								"@selected":"1"
							},
							{
								"@name": "myName2",
								"@selected": "2"
							}
						]
					}
				}
			},
			resultXml: '<component><list><item attr1="abc" attr2="cde"/></list><options><option name="myName" selected="1"/><option name="myName2" selected="2"/></options></component>'
		});

		testCases.push({
			obj: {
				'component': {
					item1: 'some text',
					item2: {
						'#cdata': 'some cdata'
					}
				}
			},
			resultXml: '<component><item1>some text</item1><item2><![CDATA[some cdata]]></item2></component>'
		});

		testCases.push({
			obj: {
				'component': {
					item1: {
						'@attr': 'abc',
						'#text': 'some text'
					},
					item2: {
						'#cdata': 'so<m>e "cd\'ata'
					}
				}
			},
			resultXml: '<component><item1 attr="abc">some text</item1><item2><![CDATA[so<m>e "cd\'ata]]></item2></component>'
		});

		for (var idx = 0; idx < testCases.length; idx++) {
			currentTestCase = testCases[idx];

			expect(caplin.core.JsonUtility.toXml(currentTestCase.obj)).toEqual(currentTestCase.resultXml);
		}
	});

	it('should respect the sTab argument', function() {
		var obj = {
			parent: {
				a: 'b',
				c: 'd'
			}
		};

		var xml = caplin.core.JsonUtility.toXml(obj, '#');

		expect(xml).toEqual('<parent>#<a>b</a>#<c>d</c></parent>');
	});

});