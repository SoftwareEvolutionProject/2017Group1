using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace js_to_ts_tool {
    public class ToggleTransformer : ITransformer {
        private string[] classes;
        public string[] Classes { get { return classes; } }

        private string[] classNames;
        public string[] ClassNames { get { return classNames; } }

        private String fileContent; 

        //+function ($) {
        static String namespaceRegexPattern = @"\+ *function";
        String classRegexPattern = @"var +[A-Za-z_][A-Za-z_0-9]* *= *function"; //@"[A-Za-z_][A-Za-z0-9_]*\.prototype";

        public ToggleTransformer (String fileContent) {
            this.fileContent = fileContent;
        }

        public static bool IsOfType(String fileContent) {
            return Regex.Match(fileContent, namespaceRegexPattern).Success;
        }

        public bool CleanUpClasses() {

            for (int i = 1; i < classes.Length; i += 2) {
                classes[i+1] = "export class " + ClassNames[i / 2] + "{ \n\tconstructor " + classes[i+1];
                classes[i + 1] = classes[i + 1].Substring(0, classes[i + 1].LastIndexOf("(jQuery);") - 1) + "}";
            }
            return true;
        }

        public bool CleanUpFunctions() {

            for (int i = 2, j=0; i < classes.Length; i += 2, j++) {
                classes[i] = classes[i].Replace(classNames[j] + ".prototype.","");
                classes[i] = Regex.Replace(classes[i], @"= *function *", "");
            }
            return true;
        }

        public bool CleanUpVariables() {
            for (int i = 2, j = 0; i < classes.Length; i += 2, j++) {
                classes[i] = Regex.Replace(classes[i], classNames[j]+@"\.", "");
            }
            return true;
        }

        public bool ExtractClasses() {
            String[] matches = Regex.Split(fileContent, "("+ classRegexPattern+ ")");
            //if (matches[0].Trim().IndexOf("var") != 0) {
            //    matches = matches.Skip(1).ToArray();
            //}
           
            //string oldMatch;
            //ArrayList classesArray = new ArrayList();
            //foreach(String m in matches) {
            //    string className;
            //    if(!classesArray.Contains(m)) {
            //        classesArray.Add(className);
            //    } 
            //    if(Regex.Match())
            //}
            //throw new NotImplementedException();

            
            classes = matches;
            return true;
        }

        public bool FetchAllClassnames() {
            classNames = new String[classes.Length / 2];

            int j = 0;
            for (int i = 1; i < classes.Length; i += 2, j++) {
                classNames[j] = classes[i].Remove(classes[i].IndexOf("=") - 1).Trim().Split().Last();
            }

            return true;
        }

        public bool FindJSNamespace() {
            return true;
        }
    }
}
