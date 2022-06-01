> ⚠️&nbsp;&nbsp;This repo contains the source for a component of the Brigade
> v1.x ecosystem. Brigade v1.x reached end-of-life on June 1, 2022 and as a
> result, this component is no longer maintained.

# brigade-vscode

A Brigade extension for Visual Studio Code.

This is currently an early prototype for Brigade folks to try out and hack on, with limited features so far!

* Brigade project explorer in Visual Studio Code activity bar
* View projects and builds
* Run a Brigade project
* Rerun a Brigade build

## Running the Extension

The extension is not yet published on the marketplace.  To work with the extension at the moment, here's what you need to do:

* If necessary, install Node.js and NPM
* If necessary, install the Brigade CLI and ensure it is on your PATH
* Clone the GitHub repo
* Open it in Visual Studio Code
* Run `npm install`
* **Then...**
  * If you want to add features to or fix bugs in the extension, make the changes you want to test and hit F5 to debug.
    In this case the extension will run under the debugger, in the Extension Development Host.
  * If you want to build the extension so you can install and use it (as if you had got it from the VS Code marketplace)...
    * Get the `vsce` tool if you don't have it already: `npm install -g vsce`
    * Run `vsce package` in the VS Code terminal. This creates a file named `brigade-vscode-<version>.vsix`
    * Go to the VS Code Extensions activity pane, click the `...` at the very top, choose `Install from VSIX...` and
      select the `brigade-vscode...` VSIX file you just created

## Contributing

### Signed commits

A DCO sign-off is required for contributions to repos in the brigadecore org. See the documentation in
[Brigade's Contributing guide](https://github.com/brigadecore/brigade/blob/master/CONTRIBUTING.md#signed-commits)
for how this is done.