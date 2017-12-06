using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace js_to_ts_tool {
    class LambdaViewTransformer : ITransformer {
        String[] classes;
        public string[] Classes { get { return classes; } }

        String[] classNames;
        public string[] ClassNames { get { return classNames; } }

        private String fileContent;

        public LambdaViewTransformer(string fileContent) {
            this.fileContent = fileContent;
        }

        public bool CleanUpClasses() {
            throw new NotImplementedException();
        }

        public bool CleanUpFunctions() {
            throw new NotImplementedException();
        }

        public bool CleanUpVariables() {
            throw new NotImplementedException();
        }

        public bool ExtractClasses() {
            throw new NotImplementedException();
        }

        public bool FetchAllClassnames() {
            throw new NotImplementedException();
        }

        public bool FindJSNamespace() {
            return true;
        }

        public static bool IsOfType(String filecontent) {
            return true;
        }

    }
}
