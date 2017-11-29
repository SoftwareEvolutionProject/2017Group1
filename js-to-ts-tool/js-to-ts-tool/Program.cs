using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace js_to_ts_tool {
    class Program {
        static void Main(string[] args) {
            if (args.Length != 1) {
                Console.WriteLine("You have to provide a file to refractor/convert");
                return;
            }

            String fileText;
            try {
                fileText = File.ReadAllText(args[0]);
            }
            catch (Exception e) {
                Console.WriteLine(e.ToString());
                return;
            }

            TransformAndRefactor tr = new TransformAndRefactor(fileText);

            if (tr.Run()) {
                Console.WriteLine("Your file was successfully refactored and transformed.");
                Console.WriteLine("Further work is still required though!");
            } else {
                Console.WriteLine("There was an error with the format of your file.");
                Console.WriteLine("The file could not be refactored and transformed.");
            }
        }
    }
}
