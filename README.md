workr
=====

The worker code for [proggr](http://github.com/codeimpossible/proggr). It's being ported to nodejs from c#.

## Installing

Currently the only way to get workr is to clone it from source.

```
$ git clone https://github.com/codeimpossible/workr.git
$ cd workr
$ yarn # or npm install
```

Now you need to create your local workr config file.

```
$ npm run init
```

This will create a `config.json` in the workr directory. It should look something like this:

```javascript
{
  "tmp": "./tmp",
  "mongo": "<your_mongo_connection_string_here>"
}
```

You'll need to replace the `mongo` property with your actual mongo connection string.

## Running

There are two modes in which you can run workr.

**Daemon Mode** - If you run `workr` with no options, it will run in daemon mode. In this mode, workr will connect to the proggr database to pick jobs to run. You won't have any control over what the workr decides to do.

**Ad-hoc Mode** - You can run `workr` with various commands to perform ad-hoc jobs. This is the mode that you would use if you wanted to use workr for your own personal use.

```
$ workr --help

Workr v1.0.0
bin/workr.js <cmd> [args]

Commands:
  clone [url]   clone a repository locally to the workr temp directory
  import [url]  imports commits from a cloned reopository
  sloc [url]    counts source lines of code from a cloned reopository

Options:
  --help  Show help                                                    [boolean]
```
