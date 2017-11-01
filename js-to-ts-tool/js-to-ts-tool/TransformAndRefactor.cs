using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.IO;

namespace js_to_ts_tool {
    class TransformAndRefactor {

        String namespaceRegexPattern = "var [A-Za-z_]+[A-Za-z0-9_-]+[= ]+.*{}";
        String classRegexPattern = ".[A-Za-z0-9_]+ ";

        String outputPath = "output/";
        
        String fileContent;
        String[] classes;
        String[] classNames;

        String jsNamespace;

        public TransformAndRefactor(String fileContent) {
            this.fileContent = fileContent;
        }

        public bool run() {
            findJSNamespace();
            extractClasses();
            fetchAllClassnames();
            cleanUpClasses();
            printToFile();
            return true;
        }
        
        private bool printToFile() {

            int j = 0;

            if (!Directory.Exists(outputPath)) {
                Console.WriteLine("directory does not exist.");
                Directory.CreateDirectory(outputPath);
            }

            for (int i = 1; i < classes.Length; i+=2, j++) {
                String path = outputPath + classNames[j] + ".ts";
                
                using (StreamWriter sw = File.CreateText(path)) {
                    sw.Write(classes[i]);
                    sw.WriteLine(classes[i + 1]);
                    sw.Close();
                }
            }

            return true;
        }

        private bool cleanUpClasses() {

            for (int i = 1; i < classes.Length; i+=2) {
                String whatToReplace = jsNamespace + ".";
                String replaceWith = "export class ";
                classes[i] = classes[i].Replace(whatToReplace, replaceWith);
            }

            return true;
        }

        private bool fetchAllClassnames() {
            classNames = new String[classes.Length/2];

            int j = 0;
            for (int i = 1; i < classes.Length; i+=2, j++) {
                String whatToReplace = jsNamespace + ".";
                classNames[j] = classes[i].Replace(whatToReplace, "").Trim();
            }

            return true;
        }

        private bool extractClasses() {
            String pattern = jsNamespace + classRegexPattern;
            classes = Regex.Split(fileContent, "(" + pattern + ")");

            return true;
        }

        /// <summary>
        /// Find the namespace of the javascript file.
        /// </summary>
        /// <returns>true if a namespace was found.</returns>
        private bool findJSNamespace() {
            Match match = Regex.Match(fileContent, namespaceRegexPattern);
            if (match.Success) {
                String[] tokens = match.ToString().Split(' ');
                if (!tokens[0].Equals("var")) {
                    jsNamespace = tokens[0];
                } else {
                    jsNamespace = tokens[1];
                }
                return true;
            } else {
                Console.Error.WriteLine("Could not find namespace!");
                return false;
            }
        }
    }
}
