using System;
using System.IO;

namespace js_to_ts_tool {
    class TransformAndRefactor {

        String outputPath = "output/";

        ITransformer transformer;

        public TransformAndRefactor(String fileContent, String outputPath = "output/") {
            this.outputPath = outputPath;

            if(JSC3DTransformer.IsOfType(fileContent)) {
                transformer = new JSC3DTransformer(fileContent);
            } else {
                throw new InvalidDataException("Could not find the format of the file.");
            }
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
                Console.WriteLine("directory does not exist, creating!");
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
