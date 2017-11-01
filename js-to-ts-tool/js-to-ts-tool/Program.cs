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

            string[] fileText;
            try {
                fileText = File.ReadAllLines(args[0]);
            }
            catch (Exception e) {
                Console.WriteLine(e.ToString());
                return;
            }

            TransformAndRefactor tr = new TransformAndRefactor(fileText);
            tr.run();
        }
    }
}
