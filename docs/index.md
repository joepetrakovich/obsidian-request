# Obsidian Request

An Obsidian plugin for adding web requests to your notes.  JSONPath for targeting, Handlebars.js for
templating the response.  Allows request chaining.

by [@joe_ptrkv_ch](https://x.com/joe_ptrkv_ch)


## Getting Started

Add a `request` codeblock to any note.  With only a URL defined, an HTTP GET request will be 
performed and the JSON will be displayed as a string. 

~~~markdown
```request
url: https://api.example.com/data
```
~~~

However, separate the request configuration with ```---``` and add a Handlebars.js template to format the output.

~~~markdown
```request
url: https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
---
<img src="{{url}}" alt="{{title}}" />
<details>
	<summary>{{title}}</summary>
	{{explanation}}
</details>
~~~

## Configuration

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `url` | string | Yes | - | HTTP/HTTPS URL |
| `method` | `GET` \| `POST` \| `PUT` \| `DELETE` | No | `GET` | HTTP method |
| `headers` | array of key-value objects | No | - | Request headers |
| `body` | string \| object | No | - | Request body |
| `path` | string | No | - | JSONPath expression |
| `then` | Config | No | - | Chained request |

Use `---` to separate config from your Handlebars template.

- [JSONPath syntax](https://goessner.net/articles/JsonPath/)
- [Handlebars templating](https://handlebarsjs.com/guide/)

## Chained Requests

Use `then` to chain requests. The second request can use values from the first response via Handlebars templates either in the url, headers, or body.  Surround with quotes if using in the body like "{{ someField }}".

~~~markdown
```request
url: http://example.com/token
method: POST
then: 
  url: http://example.com/auth
  method: POST
  headers:
    - Authorization: Bearer {{ token }}
```
~~~


## Cookbook


### Random Stoicism Quote

```request
url: https://stoic-quotes.com/api/quote
---
<blockquote><p>{{text}}</p>-{{author}}</blockquote>
```

### Random Waifu

```request
url: https://api.waifu.im/search?included_tags=maid
path: $.images[0]
---
<img src='{{url}}' />
```

### Random Bible Verse

```request
url: https://bible-api.com/data/web/random
path: $.random_verse
---
{{book}} {{chapter}}:{{verse}} 
<br />
{{text}}
```
