using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace js_to_ts_tool {
    class TransformAndRefactor {

        string[] fileContent;
        string jsNamespace;

        public TransformAndRefactor(string[] fileContent) {
            this.fileContent = fileContent;
        }

        public bool run() {
            findJSNamespace();


            return true;
        }

        /// <summary>
        /// Find the namespace of the javascript file.
        /// </summary>
        /// <returns>true if a namespace was found.</returns>
        public bool findJSNamespace() {
            for (int i = 0; i < fileContent.Length; i++) {
                if (fileContent[i].Contains("{}")) {
                    string[] words = fileContent[i].Split(' ');

                    for (int j = 0; j < words.Length; j++) {
                        if (!words[j].Equals("var")) {
                            jsNamespace = words[j];
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }
}
