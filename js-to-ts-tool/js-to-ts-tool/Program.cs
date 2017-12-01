using System;
using System.IO;
using System.Text.RegularExpressions;

namespace js_to_ts_tool
{
    class Program {
        static String outputPath = "output";
        static String path = null;
        static bool successful = true;
        static void Main(string[] args) {
            if (args.Length == 0) {
                Console.WriteLine("Too few arguments!");
                return;
            }
            for (int i = 0; i < args.Length; i++) {
                if (Directory.Exists(args[i]) || File.Exists(args[i])) {
                    path = args[i];
                }  
                if (args[i] == "-o") {
                    outputPath = args[++i];
                }
            }

            if (Directory.Exists(path)) {
                String[] files = Directory.GetFiles(path, "*.js", SearchOption.AllDirectories);
                foreach (String filepath in files) {
                    String fileName = Path.GetFileName(filepath);
                    String folderPath = Path.GetDirectoryName(filepath);
                    if (!Transform(fileName, folderPath)) {
                        successful = false;
                        return;
                    }
                }
            } else if (File.Exists(path)) {
                successful = Transform(path);
            } else {
                Console.Error.WriteLine("No file of folder specified!");
            }

            if (successful) {
                Console.WriteLine("Your file(s) was successfully refactored and transformed.");
                Console.WriteLine("Further work is still required though!");
            } else {
                Console.WriteLine("There was an error with the format of your file.");
                Console.WriteLine("The file could not be refactored and transformed.");
            }
        }

        /// <summary>
        /// Transforms a single file from js to ts
        /// </summary>
        /// <param name="filePath"> the file to be transformed</param>
        private static bool Transform(String fileName, String folderPath = "") {
            String fileText;
            try {
                fileText = File.ReadAllText(folderPath + "\\" +  fileName);
            } catch (Exception e) {
                Console.WriteLine(e.ToString());
                return false;
            }
            TransformAndRefactor tr = new TransformAndRefactor(fileText, outputPath + "\\" + folderPath);
            return tr.Run();
        }
    }
}
