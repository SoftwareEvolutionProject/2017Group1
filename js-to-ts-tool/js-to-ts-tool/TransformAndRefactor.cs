using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.IO;

namespace js_to_ts_tool {
    class TransformAndRefactor {

        String outputPath = "output/";

        ITransformer transformer;

        public TransformAndRefactor(String fileContent) {
            transformer = new JSC3DTransformer(fileContent);
        }

        public bool Run() {
            transformer.FindJSNamespace();
            transformer.ExtractClasses();
            transformer.FetchAllClassnames();
            transformer.CleanUpClasses();
            transformer.CleanUpFunctions();
            transformer.CleanUpVariables();
            PrintToFile();
            return true;
        }
        
        private bool PrintToFile() {

            int j = 0;

            if (!Directory.Exists(outputPath)) {
                Console.WriteLine("directory does not exist.");
                Directory.CreateDirectory(outputPath);
            }

            for (int i = 1; i < transformer.Classes.Length; i+=2, j++) {
                String path = outputPath + transformer.ClassNames[j] + ".ts";
                
                using (StreamWriter sw = File.CreateText(path)) {
                    sw.WriteLine(transformer.Classes[i]);
                    sw.WriteLine(transformer.Classes[i + 1]);
                    sw.Close();
                }
            }

            return true;
        }

    }
}
