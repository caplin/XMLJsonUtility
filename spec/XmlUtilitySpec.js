describe('XmlUtility', function() {

	it('should convert XML to JSON', function() {
		var testCases = [],
			currentTestCase,
			xmlDom;

		testCases.push({
			xml: '<test><prop>abc</prop></test>',
			resultJson: '{"test":{"prop":"abc"}}'
		});

		testCases.push({
			xml: '<test><prop>abc</prop><prop2>cda</prop2></test>',
			resultJson: '{"test":{"prop":"abc","prop2":"cda"}}'
		});

		testCases.push({
			xml: '<test><prop>abc</prop><prop2>a</prop2><prop2>b</prop2></test>',
			resultJson: '{"test":{"prop":"abc","prop2":["a","b"]}}'
		});

		testCases.push({
			xml: '<test><prop>abc</prop><prop2><a>a</a></prop2><prop2><a>b</a><b>a</b></prop2></test>',
			resultJson: '{"test":{"prop":"abc","prop2":[{"a":"a"},{"a":"b","b":"a"}]}}'
		});

		testCases.push({
			xml: '<test><prop>a</prop><prop2><a>b</a><c>d</c></prop2><prop3>a</prop3><prop3>b</prop3></test>',
			resultJson: '{"test":{"prop":"a","prop2":{"a":"b","c":"d"},"prop3":["a","b"]}}'
		});

		testCases.push({
			xml: '<component><list><item attr1="abc" attr2="cde"/></list><options><option name="myName" selected="1"/><option name="myName2" selected="2"/></options></component>',
			resultJson: '{"component":{"list":{"item":{"@attr1":"abc","@attr2":"cde"}},"options":{"option":[{"@name":"myName","@selected":"1"},{"@name":"myName2","@selected":"2"}]}}}'
		});

		testCases.push({
			xml: '<component><item1>some text</item1><item2><![CDATA[some cdata]]></item2></component>',
			resultJson: '{"component":{"item1":"some text","item2":{"#cdata":"some cdata"}}}'
		});

		testCases.push({
			xml: '<component><item1 attr="abc">some text</item1><item2><![CDATA[so<m>e "cd\'ata]]></item2></component>',
			resultJson: '{"component":{"item1":{"@attr":"abc","#text":"some text"},"item2":{"#cdata":"so<m>e \\"cd\'ata"}}}'
		});

		for (var idx = 0; idx < testCases.length; idx++) {
			currentTestCase = testCases[idx];

			xmlDom = (new DOMParser()).parseFromString(currentTestCase.xml, 'text/xml');

			expect(caplin.core.XmlUtility.toJson(xmlDom)).toEqual(currentTestCase.resultJson);
		}
	});

});