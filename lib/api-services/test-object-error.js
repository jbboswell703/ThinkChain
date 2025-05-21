const obj = Object.create(null);
obj.foo = "bar";
console.error("Object error:", obj);
console.error("JSON.stringify:", JSON.stringify(obj));
console.error("toString:", obj.toString ? obj.toString() : "no toString method");
