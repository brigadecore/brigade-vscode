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

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
