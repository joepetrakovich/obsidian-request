import { parseYaml, Plugin, requestUrl } from 'obsidian';
import * as z from "zod";
import { JSONPath } from 'jsonpath-plus';
import * as Handlebars from "handlebars";

const Request = z.object({
	url: z.httpUrl(),
	method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
	contentType: z.string().optional(),
	body: z.string().optional(),
	headers: z.record(z.string(), z.string()).optional(),
	path: z.string().optional()
});

export default class RequestPlugin extends Plugin {

	async onload() {
		this.registerMarkdownCodeBlockProcessor('request', async (source, el, ctx) => {
			const [config, template] = source.split(/^---$/m);
			if (!config) {
				el.appendText("Request configuration is missing.");
				return Promise.resolve();
			}

			const yaml = parseYaml(config);
			const request = Request.safeParse(yaml);

			if (!request.success) {
				el.appendText(JSON.stringify(request.error.issues));
				return Promise.resolve();
			}

			try {
				const { path, ...params } = request.data;
				const response = await requestUrl(params);

				//TODO: handle response types other than json.
				console.log("response: ", JSON.stringify(response));

				//TODO: consider jsonpaths output and how to use that within handlebars.
				// JSONPath has wrap: true which wraps in array, they could target multiple.
				// perhaps not wrapping is best, then can have default $ for path..
				// test with multiples, common replies. may be good to have some unit tests.
				const data = path ? JSONPath({ path, json: response.json }) : response.json;
				let output = JSON.stringify(data);
				if (template) {
					const ht = Handlebars.compile(template);
					output = ht(data);
				}

				el.innerHTML = output;
			}
			catch (error) {
				console.error(error);
			}
		});
	}

	onunload() {
	}

}
