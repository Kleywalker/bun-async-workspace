- Install dependencies

```sh
bun i
```

- Run tests

```sh
bun test
```

- There is a timeout

```sh
a
b
c
1
Timeout: test "logs service" timed out after 5000ms
✗ MongoDBTransport > logs service [9635.14ms]
```

- Cancel process (ctrl-c)
- Comment out `packages/server-winston-mongodb/src/Log.entity.test.ts`
- Everything works fine

```sh
a
b
c
1
2
✓ MongoDBTransport > logs service [283.03ms]

 3 pass
 0 fail
 3 expect() calls
Ran 3 tests across 4 files. [850.00ms]
```
