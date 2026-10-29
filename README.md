# Obsidian Request

An [Obsidian](https://obsidian.md) plugin for adding web requests to your notes.

- Simple and forgiving markdown codeblock for configuration.
- JSONPath for targeting the value in the response.
- [Handlebars](https://handlebarsjs.com) for templating the result.
- Request chaining

See the full documentation [here](https://joepetrakovich.github.io/obsidian-request/)

## Quick example

````
```request
url: https://science.nasa.gov/wp-json/wp/v2/apod-basic
path: $[0]
---
<img src="{{hdurl}}" alt="{{title}}" />
<details>
	<summary>{{title}}</summary>
	{{{explanation}}}
</details>
```
````

## Configuration

| field | type | required | description |
|-------|------|----------|-------------|
| url | URL | yes | The HTTP/HTTPS endpoint to request |
| method | string | no | HTTP method: GET, POST, PUT, or DELETE (default: GET) |
| headers | array | no | Request headers as key-value pairs |
| body | JSON | no | Request body (for POST/PUT requests) |
| path | string | no | [JSONPath](https://github.com/JSONPath-Plus/JSONPath) expression to extract data from response |
| then | object | no | Chain another request using data from the previous response |
| — | string | no | Separator between config and template. Use [Handlebars JS](https://handlebarsjs.com/) templates below |
