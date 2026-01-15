import { Plugin, requestUrl } from 'obsidian';
import * as z from "zod";
import { JSONPath } from 'jsonpath-plus';
import * as Handlebars from "handlebars";
import { parse } from 'config';

export default class RequestPlugin extends Plugin {

	async onload() {
		this.registerMarkdownCodeBlockProcessor('request', async (source, el, ctx) => {
			const parsed = parse(source);

			if (!parsed.success) {
				el.appendText(parsed.message);
				return Promise.resolve();
			}

			try {
				const { config: { path, ...params }, template } = parsed.data;
				const response = await requestUrl(params);
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
				//TODO: what are some good ways in Obsidian to pass detailed error logs?
				el.appendText("There was an error with the request.");
			}
		});
	}

	onunload() {
	}

}
