# @music-analyzer/serializable-data

Utility classes for fetching and serializing data in the Music Analyzer project.

## XMLParser
`xml_parser` is an instance of `fast-xml-parser` configured to parse MusicXML
strings.  It exports common options via `xml_options` and is reused by other
classes in this package.

## Serializable Base Class
`Serializable<T>` provides basic JSON serialization helpers:
- `toJSON()` and `serialize()` for converting an instance to a JSON string.
- `fromJSON()` is intended to be overridden to construct an instance from plain
  data.
- `deserialize()` parses JSON text and calls `fromJSON()`.
- `tryAndRetry()` fetches data from a URL and retries once with an added
  `?update=1` query when the initial request fails.

## JSONSerializable
An abstract class extending `Serializable` for JSON resources. `getJSON(url)`
fetches the URL and returns the deserialized object.

## XMLSerializable
Extends `Serializable` to handle XML resources. `getJSONfromXML(url)` fetches
XML text, converts it to JSON using `xml_parser`, and returns the result.

## Example
```ts
import { xml_parser } from "@music-analyzer/serializable-data";
import { JSONSerializable } from "@music-analyzer/serializable-data/src/json-serializable";

class MyData extends JSONSerializable<MyData> {
  // override fromJSON to build an instance
  fromJSON(data: Partial<MyData>): MyData {
    Object.assign(this, data);
    return this;
  }
}

MyData.getJSON<MyData, MyData>("/path/data.json")
  .then(data => console.log(data));
```
