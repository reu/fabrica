# Fabrica

TBD

## Example

```javascript
const { define, create, build } = require("fabrica")();

define("post")
  .attr("title", "Hai")

  // "Lazy" attributes
  .attr("date", () => Date.now())

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

build("post", "withoutTitle")
  .then(post => console.log(post.title || "Untitled", "by", author.name));

create("post")
  .then(post => console.log("Persisted post with id", post.id));
```
