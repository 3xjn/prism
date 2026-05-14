export type IsAssignable<Candidate, Target> = [Candidate] extends [Target] ? true : false;

export type HasProp<Props, Key> = Key extends keyof Props ? true : false;

export type IsRequired<Props, Key extends keyof Props> = {} extends Pick<Props, Key> ? false : true;

export type IsOptional<Props, Key extends keyof Props> = {} extends Pick<Props, Key> ? true : false;

export type AssertTrue<Value extends true> = Value;

export type AssertFalse<Value extends false> = Value;
