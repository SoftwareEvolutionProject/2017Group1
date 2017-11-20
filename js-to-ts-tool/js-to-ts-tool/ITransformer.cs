using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace js_to_ts_tool
{
    interface ITransformer
    {
        String[] Classes
        {
            get;
        }
        String[] ClassNames
        {
            get;
        }

        bool FindJSNamespace();
        bool ExtractClasses();
        bool FetchAllClassnames();
        bool CleanUpClasses();
        bool CleanUpFunctions();
        bool CleanUpVariables();
    }
}
