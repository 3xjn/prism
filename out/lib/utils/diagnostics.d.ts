interface DiagnosticScope {
    violation(code: string, message: () => string): void;
}
export declare const bridgeDiagnostics: DiagnosticScope;
export declare const componentDiagnostics: DiagnosticScope;
export {};
