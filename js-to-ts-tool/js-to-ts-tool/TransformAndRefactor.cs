using System;
using System.IO;

namespace js_to_ts_tool {
    class TransformAndRefactor {

        String outputPath = "";

        ITransformer transformer;

        public TransformAndRefactor(String fileContent, String outputPath = "") {
            this.outputPath = outputPath;

            if (PrototypeBestPracticeTransformer.IsOfType(fileContent)) {
                transformer = new PrototypeBestPracticeTransformer(fileContent);
            } else if (ToggleTransformer.IsOfType(fileContent)) {
                transformer = new ToggleTransformer(fileContent);
            } else if (LambdaViewTransformer.IsOfType(fileContent)) {
                transformer = new LambdaViewTransformer(fileContent);
            } else if (JSC3DTransformer.IsOfType(fileContent)) {
                transformer = new JSC3DTransformer(fileContent);
            } else {
                throw new InvalidDataException("Could not find the format of the file.");
            }
        }

        public bool Run() {
            if(!transformer.FindJSNamespace())
                return false;
            if (!transformer.ExtractClasses())
                return false;
            if (!transformer.FetchAllClassnames())
                return false;
            if (!transformer.CleanUpClasses())
                return false;
            if (!transformer.CleanUpFunctions())
                return false;
            if (!transformer.CleanUpVariables())
                return false;
            if (!PrintToFile())
                return false;
            
            return true;
        }
        
        private bool PrintToFile() {

            int j = 0;

            if (!Directory.Exists(outputPath)) {
                Console.WriteLine("directory does not exist, creating: " + outputPath);
                Directory.CreateDirectory(outputPath);
            }

            for (int i = 1; i < transformer.Classes.Length; i+=2, j++) {
                String path = outputPath + "\\" + transformer.ClassNames[j] + ".ts";

                Console.WriteLine("Writing: " + path);
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
