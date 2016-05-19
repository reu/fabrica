# Fabrica

TBD

## Example

```javascript
const { define, create, build } = require("fabrica")();

define("book")
  .attr("title", "Hai")

  // "Lazy" attributes
  .attr("date", () => Date.now())

  // "Sequence" attributes
  .sequence("isbn", sequenceNumber => `${sequenceNumber}`)

  // Relations
  .attr("author", () => create("user"))

  // Custom build method
  .build(attributes => new Post(attributes))

  // Custom create method
  .create(attributes => postRepository.create(attributes))

  // Traits
  .trait("withoutTitle", trait => {
    trait.attr("title", null);
  });

build("book", "withoutTitle")
  .then(book => console.log(book.title || "Untitled", "by", author.name));

create("book")
  .then(book => console.log("Persisted book with id", book.id));
```
