(function () {
    function stack() {
        const pst = Error.prepareStackTrace;
        const result = [];
        try {
            Error.prepareStackTrace = (_, callSites) => {
                for (let cs of callSites.slice(2)) {
                    result.push({
                        typeName: cs.getTypeName(),
                        functionName: cs.getFunctionName(),
                        methodName: cs.getMethodName(),
                        fileName: cs.getFileName(),
                        lineNumber: cs.getLineNumber(),
                        columnNumber: cs.getColumnNumber(),
                        evalOrigin: cs.getEvalOrigin(),
                        isToplevel: cs.isToplevel(),
                        isEval: cs.isEval(),
                        isNative: cs.isNative(),
                        isConstructor: cs.isConstructor(),
                    });
                }
                return result;
            };

            const _ = new Error().stack;
        } finally {
            Error.prepareStackTrace = pst;
        }
        return result;
    }

    console.log("injecting cookie interceptor");

    origDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
    Object.defineProperty(document, "cookie", {
        get() {
            return origDescriptor.get.call(this);
        },
        set(value) {
            console.log("Set cookie", value);
            window.postMessage({ cookieSetIntercepted: { cookie: value, stack: stack() } });
            return origDescriptor.set.call(this, value);
        },
        enumerable: true,
        configurable: true,
    });

    console.log("cookie interceptor installed");
})();
