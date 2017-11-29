using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace js_to_ts_tool {
    class PrototypeBestPracticeTransformer : ITransformer {
        String fileContent;

        String[] classes;
        public String[] Classes { get { return classes; } }
        String[] classNames;
        public String[] ClassNames { get { return classNames; } }

        // How to find constructor functions.
        static String classRegexPattern = @"var +[A-Za-z_][A-Za-z0-9_]* *= *function *([A-Za-z_]?[A-Za-z0-9_ ,]*)? *\( *[A-Za-z_]?[A-Za-z0-9_ ,]* *\) *{";

        public PrototypeBestPracticeTransformer(String fileContent) {
            this.fileContent = fileContent;
        }

        public static bool IsOfType(String fileContent) {
            return Regex.Match(fileContent, classRegexPattern).Success;
        }

        public bool CleanUpClasses() {
            for(int i=2, j=0;i<classes.Length;i+=2, j++) {
                classes[i] = "export class " + classNames[j] + " {\n\tconstructor " + Regex.Match(classes[i-1], @"\([A-Za-z_][A-Za-z0-9_, ]*\)") + " {" + classes[i] + "}\n";
                
//                Match s = Regex.Match(classes[i], classRegexPattern);
//                Match arguments = Regex.Match(s.ToString(), @"\([A-Za-z_][A-Za-z0-9_, ]*\)");
//                s.ToString();
//                String st = "export class " + s.ToString().Trim().Split(' ')[1] + " {\n\tconstructor " + arguments.ToString();
//                Regex.Replace(classes[i], classRegexPattern, st);
            }
            return true;
        }

        public bool CleanUpFunctions() {
            for (int i = 2, j = 0; i < classes.Length; i += 2, j++) {
                classes[i] = Regex.Replace(classes[i], @"[A-Za-z_][A-Za-z0-9_]*\.prototype\.", "");
                classes[i] = Regex.Replace(classes[i], @"= *function", " ");
            }

            return true;
        }

        public bool CleanUpVariables() {
            // Is in variable constructor. No work needed
            return true;
        }

        public bool ExtractClasses() {
            classes = Regex.Split(fileContent, "(" + classRegexPattern + ")");
            return true;
        }

        public bool FetchAllClassnames() {
            classNames = new String[classes.Length / 2];

            for (int i = 1, j = 0; i < classes.Length; i+=2, j++) {
                classNames[j] = classes[i].Trim().Split(' ')[1];
            }

            return true;
        }

        public bool FindJSNamespace() {
            return true; //Does not have namespace;
        }
    }
}
