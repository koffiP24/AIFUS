
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model EventSetting
 * 
 */
export type EventSetting = $Result.DefaultSelection<Prisma.$EventSettingPayload>
/**
 * Model PasswordReset
 * 
 */
export type PasswordReset = $Result.DefaultSelection<Prisma.$PasswordResetPayload>
/**
 * Model InscriptionGala
 * 
 */
export type InscriptionGala = $Result.DefaultSelection<Prisma.$InscriptionGalaPayload>
/**
 * Model BilletTombola
 * 
 */
export type BilletTombola = $Result.DefaultSelection<Prisma.$BilletTombolaPayload>
/**
 * Model ContactMessage
 * 
 */
export type ContactMessage = $Result.DefaultSelection<Prisma.$ContactMessagePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const CategorieInscription: {
  ACTIF: 'ACTIF',
  RETRAITE: 'RETRAITE',
  SANS_EMPLOI: 'SANS_EMPLOI',
  INVITE: 'INVITE'
};

export type CategorieInscription = (typeof CategorieInscription)[keyof typeof CategorieInscription]


export const StatutPaiement: {
  EN_ATTENTE: 'EN_ATTENTE',
  VALIDE: 'VALIDE',
  ANNULE: 'ANNULE'
};

export type StatutPaiement = (typeof StatutPaiement)[keyof typeof StatutPaiement]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type CategorieInscription = $Enums.CategorieInscription

export const CategorieInscription: typeof $Enums.CategorieInscription

export type StatutPaiement = $Enums.StatutPaiement

export const StatutPaiement: typeof $Enums.StatutPaiement

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.eventSetting`: Exposes CRUD operations for the **EventSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventSettings
    * const eventSettings = await prisma.eventSetting.findMany()
    * ```
    */
  get eventSetting(): Prisma.EventSettingDelegate<ExtArgs>;

  /**
   * `prisma.passwordReset`: Exposes CRUD operations for the **PasswordReset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResets
    * const passwordResets = await prisma.passwordReset.findMany()
    * ```
    */
  get passwordReset(): Prisma.PasswordResetDelegate<ExtArgs>;

  /**
   * `prisma.inscriptionGala`: Exposes CRUD operations for the **InscriptionGala** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InscriptionGalas
    * const inscriptionGalas = await prisma.inscriptionGala.findMany()
    * ```
    */
  get inscriptionGala(): Prisma.InscriptionGalaDelegate<ExtArgs>;

  /**
   * `prisma.billetTombola`: Exposes CRUD operations for the **BilletTombola** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BilletTombolas
    * const billetTombolas = await prisma.billetTombola.findMany()
    * ```
    */
  get billetTombola(): Prisma.BilletTombolaDelegate<ExtArgs>;

  /**
   * `prisma.contactMessage`: Exposes CRUD operations for the **ContactMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContactMessages
    * const contactMessages = await prisma.contactMessage.findMany()
    * ```
    */
  get contactMessage(): Prisma.ContactMessageDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    EventSetting: 'EventSetting',
    PasswordReset: 'PasswordReset',
    InscriptionGala: 'InscriptionGala',
    BilletTombola: 'BilletTombola',
    ContactMessage: 'ContactMessage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "eventSetting" | "passwordReset" | "inscriptionGala" | "billetTombola" | "contactMessage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      EventSetting: {
        payload: Prisma.$EventSettingPayload<ExtArgs>
        fields: Prisma.EventSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload>
          }
          findFirst: {
            args: Prisma.EventSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload>
          }
          findMany: {
            args: Prisma.EventSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload>[]
          }
          create: {
            args: Prisma.EventSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload>
          }
          createMany: {
            args: Prisma.EventSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EventSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload>
          }
          update: {
            args: Prisma.EventSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload>
          }
          deleteMany: {
            args: Prisma.EventSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventSettingPayload>
          }
          aggregate: {
            args: Prisma.EventSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventSetting>
          }
          groupBy: {
            args: Prisma.EventSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventSettingCountArgs<ExtArgs>
            result: $Utils.Optional<EventSettingCountAggregateOutputType> | number
          }
        }
      }
      PasswordReset: {
        payload: Prisma.$PasswordResetPayload<ExtArgs>
        fields: Prisma.PasswordResetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          findMany: {
            args: Prisma.PasswordResetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>[]
          }
          create: {
            args: Prisma.PasswordResetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          createMany: {
            args: Prisma.PasswordResetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PasswordResetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          update: {
            args: Prisma.PasswordResetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PasswordResetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordReset>
          }
          groupBy: {
            args: Prisma.PasswordResetGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetCountAggregateOutputType> | number
          }
        }
      }
      InscriptionGala: {
        payload: Prisma.$InscriptionGalaPayload<ExtArgs>
        fields: Prisma.InscriptionGalaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InscriptionGalaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InscriptionGalaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload>
          }
          findFirst: {
            args: Prisma.InscriptionGalaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InscriptionGalaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload>
          }
          findMany: {
            args: Prisma.InscriptionGalaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload>[]
          }
          create: {
            args: Prisma.InscriptionGalaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload>
          }
          createMany: {
            args: Prisma.InscriptionGalaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InscriptionGalaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload>
          }
          update: {
            args: Prisma.InscriptionGalaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload>
          }
          deleteMany: {
            args: Prisma.InscriptionGalaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InscriptionGalaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InscriptionGalaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionGalaPayload>
          }
          aggregate: {
            args: Prisma.InscriptionGalaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInscriptionGala>
          }
          groupBy: {
            args: Prisma.InscriptionGalaGroupByArgs<ExtArgs>
            result: $Utils.Optional<InscriptionGalaGroupByOutputType>[]
          }
          count: {
            args: Prisma.InscriptionGalaCountArgs<ExtArgs>
            result: $Utils.Optional<InscriptionGalaCountAggregateOutputType> | number
          }
        }
      }
      BilletTombola: {
        payload: Prisma.$BilletTombolaPayload<ExtArgs>
        fields: Prisma.BilletTombolaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BilletTombolaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BilletTombolaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload>
          }
          findFirst: {
            args: Prisma.BilletTombolaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BilletTombolaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload>
          }
          findMany: {
            args: Prisma.BilletTombolaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload>[]
          }
          create: {
            args: Prisma.BilletTombolaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload>
          }
          createMany: {
            args: Prisma.BilletTombolaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BilletTombolaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload>
          }
          update: {
            args: Prisma.BilletTombolaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload>
          }
          deleteMany: {
            args: Prisma.BilletTombolaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BilletTombolaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BilletTombolaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilletTombolaPayload>
          }
          aggregate: {
            args: Prisma.BilletTombolaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBilletTombola>
          }
          groupBy: {
            args: Prisma.BilletTombolaGroupByArgs<ExtArgs>
            result: $Utils.Optional<BilletTombolaGroupByOutputType>[]
          }
          count: {
            args: Prisma.BilletTombolaCountArgs<ExtArgs>
            result: $Utils.Optional<BilletTombolaCountAggregateOutputType> | number
          }
        }
      }
      ContactMessage: {
        payload: Prisma.$ContactMessagePayload<ExtArgs>
        fields: Prisma.ContactMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          findFirst: {
            args: Prisma.ContactMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          findMany: {
            args: Prisma.ContactMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>[]
          }
          create: {
            args: Prisma.ContactMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          createMany: {
            args: Prisma.ContactMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ContactMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          update: {
            args: Prisma.ContactMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          deleteMany: {
            args: Prisma.ContactMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ContactMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          aggregate: {
            args: Prisma.ContactMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContactMessage>
          }
          groupBy: {
            args: Prisma.ContactMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ContactMessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    inscriptionsGala: number
    scannedInscriptions: number
    billetsTombola: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inscriptionsGala?: boolean | UserCountOutputTypeCountInscriptionsGalaArgs
    scannedInscriptions?: boolean | UserCountOutputTypeCountScannedInscriptionsArgs
    billetsTombola?: boolean | UserCountOutputTypeCountBilletsTombolaArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInscriptionsGalaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InscriptionGalaWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountScannedInscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InscriptionGalaWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBilletsTombolaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BilletTombolaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    nom: string | null
    prenom: string | null
    telephone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    nom: string | null
    prenom: string | null
    telephone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    role: number
    nom: number
    prenom: number
    telephone: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    nom?: true
    prenom?: true
    telephone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    nom?: true
    prenom?: true
    telephone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    nom?: true
    prenom?: true
    telephone?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    password: string
    role: $Enums.Role
    nom: string
    prenom: string
    telephone: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    nom?: boolean
    prenom?: boolean
    telephone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inscriptionsGala?: boolean | User$inscriptionsGalaArgs<ExtArgs>
    scannedInscriptions?: boolean | User$scannedInscriptionsArgs<ExtArgs>
    billetsTombola?: boolean | User$billetsTombolaArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>


  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    nom?: boolean
    prenom?: boolean
    telephone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inscriptionsGala?: boolean | User$inscriptionsGalaArgs<ExtArgs>
    scannedInscriptions?: boolean | User$scannedInscriptionsArgs<ExtArgs>
    billetsTombola?: boolean | User$billetsTombolaArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      inscriptionsGala: Prisma.$InscriptionGalaPayload<ExtArgs>[]
      scannedInscriptions: Prisma.$InscriptionGalaPayload<ExtArgs>[]
      billetsTombola: Prisma.$BilletTombolaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      password: string
      role: $Enums.Role
      nom: string
      prenom: string
      telephone: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inscriptionsGala<T extends User$inscriptionsGalaArgs<ExtArgs> = {}>(args?: Subset<T, User$inscriptionsGalaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "findMany"> | Null>
    scannedInscriptions<T extends User$scannedInscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, User$scannedInscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "findMany"> | Null>
    billetsTombola<T extends User$billetsTombolaArgs<ExtArgs> = {}>(args?: Subset<T, User$billetsTombolaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly nom: FieldRef<"User", 'String'>
    readonly prenom: FieldRef<"User", 'String'>
    readonly telephone: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.inscriptionsGala
   */
  export type User$inscriptionsGalaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    where?: InscriptionGalaWhereInput
    orderBy?: InscriptionGalaOrderByWithRelationInput | InscriptionGalaOrderByWithRelationInput[]
    cursor?: InscriptionGalaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InscriptionGalaScalarFieldEnum | InscriptionGalaScalarFieldEnum[]
  }

  /**
   * User.scannedInscriptions
   */
  export type User$scannedInscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    where?: InscriptionGalaWhereInput
    orderBy?: InscriptionGalaOrderByWithRelationInput | InscriptionGalaOrderByWithRelationInput[]
    cursor?: InscriptionGalaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InscriptionGalaScalarFieldEnum | InscriptionGalaScalarFieldEnum[]
  }

  /**
   * User.billetsTombola
   */
  export type User$billetsTombolaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    where?: BilletTombolaWhereInput
    orderBy?: BilletTombolaOrderByWithRelationInput | BilletTombolaOrderByWithRelationInput[]
    cursor?: BilletTombolaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BilletTombolaScalarFieldEnum | BilletTombolaScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model EventSetting
   */

  export type AggregateEventSetting = {
    _count: EventSettingCountAggregateOutputType | null
    _avg: EventSettingAvgAggregateOutputType | null
    _sum: EventSettingSumAggregateOutputType | null
    _min: EventSettingMinAggregateOutputType | null
    _max: EventSettingMaxAggregateOutputType | null
  }

  export type EventSettingAvgAggregateOutputType = {
    id: number | null
  }

  export type EventSettingSumAggregateOutputType = {
    id: number | null
  }

  export type EventSettingMinAggregateOutputType = {
    id: number | null
    key: string | null
    title: string | null
    subtitle: string | null
    description: string | null
    location: string | null
    startsAt: Date | null
    endsAt: Date | null
    isPublished: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventSettingMaxAggregateOutputType = {
    id: number | null
    key: string | null
    title: string | null
    subtitle: string | null
    description: string | null
    location: string | null
    startsAt: Date | null
    endsAt: Date | null
    isPublished: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventSettingCountAggregateOutputType = {
    id: number
    key: number
    title: number
    subtitle: number
    description: number
    location: number
    startsAt: number
    endsAt: number
    isPublished: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventSettingAvgAggregateInputType = {
    id?: true
  }

  export type EventSettingSumAggregateInputType = {
    id?: true
  }

  export type EventSettingMinAggregateInputType = {
    id?: true
    key?: true
    title?: true
    subtitle?: true
    description?: true
    location?: true
    startsAt?: true
    endsAt?: true
    isPublished?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventSettingMaxAggregateInputType = {
    id?: true
    key?: true
    title?: true
    subtitle?: true
    description?: true
    location?: true
    startsAt?: true
    endsAt?: true
    isPublished?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventSettingCountAggregateInputType = {
    id?: true
    key?: true
    title?: true
    subtitle?: true
    description?: true
    location?: true
    startsAt?: true
    endsAt?: true
    isPublished?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventSetting to aggregate.
     */
    where?: EventSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventSettings to fetch.
     */
    orderBy?: EventSettingOrderByWithRelationInput | EventSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventSettings
    **/
    _count?: true | EventSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventSettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventSettingMaxAggregateInputType
  }

  export type GetEventSettingAggregateType<T extends EventSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateEventSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventSetting[P]>
      : GetScalarType<T[P], AggregateEventSetting[P]>
  }




  export type EventSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventSettingWhereInput
    orderBy?: EventSettingOrderByWithAggregationInput | EventSettingOrderByWithAggregationInput[]
    by: EventSettingScalarFieldEnum[] | EventSettingScalarFieldEnum
    having?: EventSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventSettingCountAggregateInputType | true
    _avg?: EventSettingAvgAggregateInputType
    _sum?: EventSettingSumAggregateInputType
    _min?: EventSettingMinAggregateInputType
    _max?: EventSettingMaxAggregateInputType
  }

  export type EventSettingGroupByOutputType = {
    id: number
    key: string
    title: string
    subtitle: string | null
    description: string | null
    location: string | null
    startsAt: Date | null
    endsAt: Date | null
    isPublished: boolean
    createdAt: Date
    updatedAt: Date
    _count: EventSettingCountAggregateOutputType | null
    _avg: EventSettingAvgAggregateOutputType | null
    _sum: EventSettingSumAggregateOutputType | null
    _min: EventSettingMinAggregateOutputType | null
    _max: EventSettingMaxAggregateOutputType | null
  }

  type GetEventSettingGroupByPayload<T extends EventSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventSettingGroupByOutputType[P]>
            : GetScalarType<T[P], EventSettingGroupByOutputType[P]>
        }
      >
    >


  export type EventSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    title?: boolean
    subtitle?: boolean
    description?: boolean
    location?: boolean
    startsAt?: boolean
    endsAt?: boolean
    isPublished?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["eventSetting"]>


  export type EventSettingSelectScalar = {
    id?: boolean
    key?: boolean
    title?: boolean
    subtitle?: boolean
    description?: boolean
    location?: boolean
    startsAt?: boolean
    endsAt?: boolean
    isPublished?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $EventSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      key: string
      title: string
      subtitle: string | null
      description: string | null
      location: string | null
      startsAt: Date | null
      endsAt: Date | null
      isPublished: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["eventSetting"]>
    composites: {}
  }

  type EventSettingGetPayload<S extends boolean | null | undefined | EventSettingDefaultArgs> = $Result.GetResult<Prisma.$EventSettingPayload, S>

  type EventSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventSettingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventSettingCountAggregateInputType | true
    }

  export interface EventSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventSetting'], meta: { name: 'EventSetting' } }
    /**
     * Find zero or one EventSetting that matches the filter.
     * @param {EventSettingFindUniqueArgs} args - Arguments to find a EventSetting
     * @example
     * // Get one EventSetting
     * const eventSetting = await prisma.eventSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventSettingFindUniqueArgs>(args: SelectSubset<T, EventSettingFindUniqueArgs<ExtArgs>>): Prisma__EventSettingClient<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EventSetting that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventSettingFindUniqueOrThrowArgs} args - Arguments to find a EventSetting
     * @example
     * // Get one EventSetting
     * const eventSetting = await prisma.eventSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, EventSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventSettingClient<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EventSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSettingFindFirstArgs} args - Arguments to find a EventSetting
     * @example
     * // Get one EventSetting
     * const eventSetting = await prisma.eventSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventSettingFindFirstArgs>(args?: SelectSubset<T, EventSettingFindFirstArgs<ExtArgs>>): Prisma__EventSettingClient<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EventSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSettingFindFirstOrThrowArgs} args - Arguments to find a EventSetting
     * @example
     * // Get one EventSetting
     * const eventSetting = await prisma.eventSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, EventSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventSettingClient<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EventSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventSettings
     * const eventSettings = await prisma.eventSetting.findMany()
     * 
     * // Get first 10 EventSettings
     * const eventSettings = await prisma.eventSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventSettingWithIdOnly = await prisma.eventSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventSettingFindManyArgs>(args?: SelectSubset<T, EventSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EventSetting.
     * @param {EventSettingCreateArgs} args - Arguments to create a EventSetting.
     * @example
     * // Create one EventSetting
     * const EventSetting = await prisma.eventSetting.create({
     *   data: {
     *     // ... data to create a EventSetting
     *   }
     * })
     * 
     */
    create<T extends EventSettingCreateArgs>(args: SelectSubset<T, EventSettingCreateArgs<ExtArgs>>): Prisma__EventSettingClient<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EventSettings.
     * @param {EventSettingCreateManyArgs} args - Arguments to create many EventSettings.
     * @example
     * // Create many EventSettings
     * const eventSetting = await prisma.eventSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventSettingCreateManyArgs>(args?: SelectSubset<T, EventSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a EventSetting.
     * @param {EventSettingDeleteArgs} args - Arguments to delete one EventSetting.
     * @example
     * // Delete one EventSetting
     * const EventSetting = await prisma.eventSetting.delete({
     *   where: {
     *     // ... filter to delete one EventSetting
     *   }
     * })
     * 
     */
    delete<T extends EventSettingDeleteArgs>(args: SelectSubset<T, EventSettingDeleteArgs<ExtArgs>>): Prisma__EventSettingClient<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EventSetting.
     * @param {EventSettingUpdateArgs} args - Arguments to update one EventSetting.
     * @example
     * // Update one EventSetting
     * const eventSetting = await prisma.eventSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventSettingUpdateArgs>(args: SelectSubset<T, EventSettingUpdateArgs<ExtArgs>>): Prisma__EventSettingClient<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EventSettings.
     * @param {EventSettingDeleteManyArgs} args - Arguments to filter EventSettings to delete.
     * @example
     * // Delete a few EventSettings
     * const { count } = await prisma.eventSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventSettingDeleteManyArgs>(args?: SelectSubset<T, EventSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventSettings
     * const eventSetting = await prisma.eventSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventSettingUpdateManyArgs>(args: SelectSubset<T, EventSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EventSetting.
     * @param {EventSettingUpsertArgs} args - Arguments to update or create a EventSetting.
     * @example
     * // Update or create a EventSetting
     * const eventSetting = await prisma.eventSetting.upsert({
     *   create: {
     *     // ... data to create a EventSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventSetting we want to update
     *   }
     * })
     */
    upsert<T extends EventSettingUpsertArgs>(args: SelectSubset<T, EventSettingUpsertArgs<ExtArgs>>): Prisma__EventSettingClient<$Result.GetResult<Prisma.$EventSettingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EventSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSettingCountArgs} args - Arguments to filter EventSettings to count.
     * @example
     * // Count the number of EventSettings
     * const count = await prisma.eventSetting.count({
     *   where: {
     *     // ... the filter for the EventSettings we want to count
     *   }
     * })
    **/
    count<T extends EventSettingCountArgs>(
      args?: Subset<T, EventSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventSettingAggregateArgs>(args: Subset<T, EventSettingAggregateArgs>): Prisma.PrismaPromise<GetEventSettingAggregateType<T>>

    /**
     * Group by EventSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventSettingGroupByArgs['orderBy'] }
        : { orderBy?: EventSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventSetting model
   */
  readonly fields: EventSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventSetting model
   */ 
  interface EventSettingFieldRefs {
    readonly id: FieldRef<"EventSetting", 'Int'>
    readonly key: FieldRef<"EventSetting", 'String'>
    readonly title: FieldRef<"EventSetting", 'String'>
    readonly subtitle: FieldRef<"EventSetting", 'String'>
    readonly description: FieldRef<"EventSetting", 'String'>
    readonly location: FieldRef<"EventSetting", 'String'>
    readonly startsAt: FieldRef<"EventSetting", 'DateTime'>
    readonly endsAt: FieldRef<"EventSetting", 'DateTime'>
    readonly isPublished: FieldRef<"EventSetting", 'Boolean'>
    readonly createdAt: FieldRef<"EventSetting", 'DateTime'>
    readonly updatedAt: FieldRef<"EventSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EventSetting findUnique
   */
  export type EventSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * Filter, which EventSetting to fetch.
     */
    where: EventSettingWhereUniqueInput
  }

  /**
   * EventSetting findUniqueOrThrow
   */
  export type EventSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * Filter, which EventSetting to fetch.
     */
    where: EventSettingWhereUniqueInput
  }

  /**
   * EventSetting findFirst
   */
  export type EventSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * Filter, which EventSetting to fetch.
     */
    where?: EventSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventSettings to fetch.
     */
    orderBy?: EventSettingOrderByWithRelationInput | EventSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventSettings.
     */
    cursor?: EventSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventSettings.
     */
    distinct?: EventSettingScalarFieldEnum | EventSettingScalarFieldEnum[]
  }

  /**
   * EventSetting findFirstOrThrow
   */
  export type EventSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * Filter, which EventSetting to fetch.
     */
    where?: EventSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventSettings to fetch.
     */
    orderBy?: EventSettingOrderByWithRelationInput | EventSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventSettings.
     */
    cursor?: EventSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventSettings.
     */
    distinct?: EventSettingScalarFieldEnum | EventSettingScalarFieldEnum[]
  }

  /**
   * EventSetting findMany
   */
  export type EventSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * Filter, which EventSettings to fetch.
     */
    where?: EventSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventSettings to fetch.
     */
    orderBy?: EventSettingOrderByWithRelationInput | EventSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventSettings.
     */
    cursor?: EventSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventSettings.
     */
    skip?: number
    distinct?: EventSettingScalarFieldEnum | EventSettingScalarFieldEnum[]
  }

  /**
   * EventSetting create
   */
  export type EventSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * The data needed to create a EventSetting.
     */
    data: XOR<EventSettingCreateInput, EventSettingUncheckedCreateInput>
  }

  /**
   * EventSetting createMany
   */
  export type EventSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventSettings.
     */
    data: EventSettingCreateManyInput | EventSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventSetting update
   */
  export type EventSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * The data needed to update a EventSetting.
     */
    data: XOR<EventSettingUpdateInput, EventSettingUncheckedUpdateInput>
    /**
     * Choose, which EventSetting to update.
     */
    where: EventSettingWhereUniqueInput
  }

  /**
   * EventSetting updateMany
   */
  export type EventSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventSettings.
     */
    data: XOR<EventSettingUpdateManyMutationInput, EventSettingUncheckedUpdateManyInput>
    /**
     * Filter which EventSettings to update
     */
    where?: EventSettingWhereInput
  }

  /**
   * EventSetting upsert
   */
  export type EventSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * The filter to search for the EventSetting to update in case it exists.
     */
    where: EventSettingWhereUniqueInput
    /**
     * In case the EventSetting found by the `where` argument doesn't exist, create a new EventSetting with this data.
     */
    create: XOR<EventSettingCreateInput, EventSettingUncheckedCreateInput>
    /**
     * In case the EventSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventSettingUpdateInput, EventSettingUncheckedUpdateInput>
  }

  /**
   * EventSetting delete
   */
  export type EventSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
    /**
     * Filter which EventSetting to delete.
     */
    where: EventSettingWhereUniqueInput
  }

  /**
   * EventSetting deleteMany
   */
  export type EventSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventSettings to delete
     */
    where?: EventSettingWhereInput
  }

  /**
   * EventSetting without action
   */
  export type EventSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventSetting
     */
    select?: EventSettingSelect<ExtArgs> | null
  }


  /**
   * Model PasswordReset
   */

  export type AggregatePasswordReset = {
    _count: PasswordResetCountAggregateOutputType | null
    _avg: PasswordResetAvgAggregateOutputType | null
    _sum: PasswordResetSumAggregateOutputType | null
    _min: PasswordResetMinAggregateOutputType | null
    _max: PasswordResetMaxAggregateOutputType | null
  }

  export type PasswordResetAvgAggregateOutputType = {
    id: number | null
  }

  export type PasswordResetSumAggregateOutputType = {
    id: number | null
  }

  export type PasswordResetMinAggregateOutputType = {
    id: number | null
    identifier: string | null
    token: string | null
    code: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetMaxAggregateOutputType = {
    id: number | null
    identifier: string | null
    token: string | null
    code: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetCountAggregateOutputType = {
    id: number
    identifier: number
    token: number
    code: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type PasswordResetAvgAggregateInputType = {
    id?: true
  }

  export type PasswordResetSumAggregateInputType = {
    id?: true
  }

  export type PasswordResetMinAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    code?: true
    expiresAt?: true
    createdAt?: true
  }

  export type PasswordResetMaxAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    code?: true
    expiresAt?: true
    createdAt?: true
  }

  export type PasswordResetCountAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    code?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordReset to aggregate.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResets
    **/
    _count?: true | PasswordResetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasswordResetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasswordResetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetMaxAggregateInputType
  }

  export type GetPasswordResetAggregateType<T extends PasswordResetAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordReset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordReset[P]>
      : GetScalarType<T[P], AggregatePasswordReset[P]>
  }




  export type PasswordResetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetWhereInput
    orderBy?: PasswordResetOrderByWithAggregationInput | PasswordResetOrderByWithAggregationInput[]
    by: PasswordResetScalarFieldEnum[] | PasswordResetScalarFieldEnum
    having?: PasswordResetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetCountAggregateInputType | true
    _avg?: PasswordResetAvgAggregateInputType
    _sum?: PasswordResetSumAggregateInputType
    _min?: PasswordResetMinAggregateInputType
    _max?: PasswordResetMaxAggregateInputType
  }

  export type PasswordResetGroupByOutputType = {
    id: number
    identifier: string
    token: string | null
    code: string | null
    expiresAt: Date
    createdAt: Date
    _count: PasswordResetCountAggregateOutputType | null
    _avg: PasswordResetAvgAggregateOutputType | null
    _sum: PasswordResetSumAggregateOutputType | null
    _min: PasswordResetMinAggregateOutputType | null
    _max: PasswordResetMaxAggregateOutputType | null
  }

  type GetPasswordResetGroupByPayload<T extends PasswordResetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    token?: boolean
    code?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordReset"]>


  export type PasswordResetSelectScalar = {
    id?: boolean
    identifier?: boolean
    token?: boolean
    code?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }


  export type $PasswordResetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordReset"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      identifier: string
      token: string | null
      code: string | null
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["passwordReset"]>
    composites: {}
  }

  type PasswordResetGetPayload<S extends boolean | null | undefined | PasswordResetDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetPayload, S>

  type PasswordResetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PasswordResetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PasswordResetCountAggregateInputType | true
    }

  export interface PasswordResetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordReset'], meta: { name: 'PasswordReset' } }
    /**
     * Find zero or one PasswordReset that matches the filter.
     * @param {PasswordResetFindUniqueArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetFindUniqueArgs>(args: SelectSubset<T, PasswordResetFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PasswordReset that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PasswordResetFindUniqueOrThrowArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PasswordReset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindFirstArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetFindFirstArgs>(args?: SelectSubset<T, PasswordResetFindFirstArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PasswordReset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindFirstOrThrowArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PasswordResets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResets
     * const passwordResets = await prisma.passwordReset.findMany()
     * 
     * // Get first 10 PasswordResets
     * const passwordResets = await prisma.passwordReset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetWithIdOnly = await prisma.passwordReset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetFindManyArgs>(args?: SelectSubset<T, PasswordResetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PasswordReset.
     * @param {PasswordResetCreateArgs} args - Arguments to create a PasswordReset.
     * @example
     * // Create one PasswordReset
     * const PasswordReset = await prisma.passwordReset.create({
     *   data: {
     *     // ... data to create a PasswordReset
     *   }
     * })
     * 
     */
    create<T extends PasswordResetCreateArgs>(args: SelectSubset<T, PasswordResetCreateArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PasswordResets.
     * @param {PasswordResetCreateManyArgs} args - Arguments to create many PasswordResets.
     * @example
     * // Create many PasswordResets
     * const passwordReset = await prisma.passwordReset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetCreateManyArgs>(args?: SelectSubset<T, PasswordResetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PasswordReset.
     * @param {PasswordResetDeleteArgs} args - Arguments to delete one PasswordReset.
     * @example
     * // Delete one PasswordReset
     * const PasswordReset = await prisma.passwordReset.delete({
     *   where: {
     *     // ... filter to delete one PasswordReset
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetDeleteArgs>(args: SelectSubset<T, PasswordResetDeleteArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PasswordReset.
     * @param {PasswordResetUpdateArgs} args - Arguments to update one PasswordReset.
     * @example
     * // Update one PasswordReset
     * const passwordReset = await prisma.passwordReset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetUpdateArgs>(args: SelectSubset<T, PasswordResetUpdateArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PasswordResets.
     * @param {PasswordResetDeleteManyArgs} args - Arguments to filter PasswordResets to delete.
     * @example
     * // Delete a few PasswordResets
     * const { count } = await prisma.passwordReset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetDeleteManyArgs>(args?: SelectSubset<T, PasswordResetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResets
     * const passwordReset = await prisma.passwordReset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetUpdateManyArgs>(args: SelectSubset<T, PasswordResetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PasswordReset.
     * @param {PasswordResetUpsertArgs} args - Arguments to update or create a PasswordReset.
     * @example
     * // Update or create a PasswordReset
     * const passwordReset = await prisma.passwordReset.upsert({
     *   create: {
     *     // ... data to create a PasswordReset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordReset we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetUpsertArgs>(args: SelectSubset<T, PasswordResetUpsertArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PasswordResets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCountArgs} args - Arguments to filter PasswordResets to count.
     * @example
     * // Count the number of PasswordResets
     * const count = await prisma.passwordReset.count({
     *   where: {
     *     // ... the filter for the PasswordResets we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetCountArgs>(
      args?: Subset<T, PasswordResetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordReset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetAggregateArgs>(args: Subset<T, PasswordResetAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetAggregateType<T>>

    /**
     * Group by PasswordReset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordReset model
   */
  readonly fields: PasswordResetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordReset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordReset model
   */ 
  interface PasswordResetFieldRefs {
    readonly id: FieldRef<"PasswordReset", 'Int'>
    readonly identifier: FieldRef<"PasswordReset", 'String'>
    readonly token: FieldRef<"PasswordReset", 'String'>
    readonly code: FieldRef<"PasswordReset", 'String'>
    readonly expiresAt: FieldRef<"PasswordReset", 'DateTime'>
    readonly createdAt: FieldRef<"PasswordReset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordReset findUnique
   */
  export type PasswordResetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset findUniqueOrThrow
   */
  export type PasswordResetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset findFirst
   */
  export type PasswordResetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResets.
     */
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset findFirstOrThrow
   */
  export type PasswordResetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResets.
     */
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset findMany
   */
  export type PasswordResetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter, which PasswordResets to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset create
   */
  export type PasswordResetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * The data needed to create a PasswordReset.
     */
    data: XOR<PasswordResetCreateInput, PasswordResetUncheckedCreateInput>
  }

  /**
   * PasswordReset createMany
   */
  export type PasswordResetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResets.
     */
    data: PasswordResetCreateManyInput | PasswordResetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordReset update
   */
  export type PasswordResetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * The data needed to update a PasswordReset.
     */
    data: XOR<PasswordResetUpdateInput, PasswordResetUncheckedUpdateInput>
    /**
     * Choose, which PasswordReset to update.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset updateMany
   */
  export type PasswordResetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResets.
     */
    data: XOR<PasswordResetUpdateManyMutationInput, PasswordResetUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResets to update
     */
    where?: PasswordResetWhereInput
  }

  /**
   * PasswordReset upsert
   */
  export type PasswordResetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * The filter to search for the PasswordReset to update in case it exists.
     */
    where: PasswordResetWhereUniqueInput
    /**
     * In case the PasswordReset found by the `where` argument doesn't exist, create a new PasswordReset with this data.
     */
    create: XOR<PasswordResetCreateInput, PasswordResetUncheckedCreateInput>
    /**
     * In case the PasswordReset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetUpdateInput, PasswordResetUncheckedUpdateInput>
  }

  /**
   * PasswordReset delete
   */
  export type PasswordResetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Filter which PasswordReset to delete.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset deleteMany
   */
  export type PasswordResetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResets to delete
     */
    where?: PasswordResetWhereInput
  }

  /**
   * PasswordReset without action
   */
  export type PasswordResetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
  }


  /**
   * Model InscriptionGala
   */

  export type AggregateInscriptionGala = {
    _count: InscriptionGalaCountAggregateOutputType | null
    _avg: InscriptionGalaAvgAggregateOutputType | null
    _sum: InscriptionGalaSumAggregateOutputType | null
    _min: InscriptionGalaMinAggregateOutputType | null
    _max: InscriptionGalaMaxAggregateOutputType | null
  }

  export type InscriptionGalaAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    nombreInvites: number | null
    montantTotal: number | null
    checkedInById: number | null
  }

  export type InscriptionGalaSumAggregateOutputType = {
    id: number | null
    userId: number | null
    nombreInvites: number | null
    montantTotal: number | null
    checkedInById: number | null
  }

  export type InscriptionGalaMinAggregateOutputType = {
    id: number | null
    userId: number | null
    categorie: $Enums.CategorieInscription | null
    nombreInvites: number | null
    montantTotal: number | null
    statutPaiement: $Enums.StatutPaiement | null
    referencePaiement: string | null
    ticketCode: string | null
    qrToken: string | null
    checkedInAt: Date | null
    checkedInById: number | null
    createdAt: Date | null
  }

  export type InscriptionGalaMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    categorie: $Enums.CategorieInscription | null
    nombreInvites: number | null
    montantTotal: number | null
    statutPaiement: $Enums.StatutPaiement | null
    referencePaiement: string | null
    ticketCode: string | null
    qrToken: string | null
    checkedInAt: Date | null
    checkedInById: number | null
    createdAt: Date | null
  }

  export type InscriptionGalaCountAggregateOutputType = {
    id: number
    userId: number
    categorie: number
    nombreInvites: number
    montantTotal: number
    statutPaiement: number
    referencePaiement: number
    ticketCode: number
    qrToken: number
    checkedInAt: number
    checkedInById: number
    createdAt: number
    _all: number
  }


  export type InscriptionGalaAvgAggregateInputType = {
    id?: true
    userId?: true
    nombreInvites?: true
    montantTotal?: true
    checkedInById?: true
  }

  export type InscriptionGalaSumAggregateInputType = {
    id?: true
    userId?: true
    nombreInvites?: true
    montantTotal?: true
    checkedInById?: true
  }

  export type InscriptionGalaMinAggregateInputType = {
    id?: true
    userId?: true
    categorie?: true
    nombreInvites?: true
    montantTotal?: true
    statutPaiement?: true
    referencePaiement?: true
    ticketCode?: true
    qrToken?: true
    checkedInAt?: true
    checkedInById?: true
    createdAt?: true
  }

  export type InscriptionGalaMaxAggregateInputType = {
    id?: true
    userId?: true
    categorie?: true
    nombreInvites?: true
    montantTotal?: true
    statutPaiement?: true
    referencePaiement?: true
    ticketCode?: true
    qrToken?: true
    checkedInAt?: true
    checkedInById?: true
    createdAt?: true
  }

  export type InscriptionGalaCountAggregateInputType = {
    id?: true
    userId?: true
    categorie?: true
    nombreInvites?: true
    montantTotal?: true
    statutPaiement?: true
    referencePaiement?: true
    ticketCode?: true
    qrToken?: true
    checkedInAt?: true
    checkedInById?: true
    createdAt?: true
    _all?: true
  }

  export type InscriptionGalaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InscriptionGala to aggregate.
     */
    where?: InscriptionGalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InscriptionGalas to fetch.
     */
    orderBy?: InscriptionGalaOrderByWithRelationInput | InscriptionGalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InscriptionGalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InscriptionGalas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InscriptionGalas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InscriptionGalas
    **/
    _count?: true | InscriptionGalaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InscriptionGalaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InscriptionGalaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InscriptionGalaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InscriptionGalaMaxAggregateInputType
  }

  export type GetInscriptionGalaAggregateType<T extends InscriptionGalaAggregateArgs> = {
        [P in keyof T & keyof AggregateInscriptionGala]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInscriptionGala[P]>
      : GetScalarType<T[P], AggregateInscriptionGala[P]>
  }




  export type InscriptionGalaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InscriptionGalaWhereInput
    orderBy?: InscriptionGalaOrderByWithAggregationInput | InscriptionGalaOrderByWithAggregationInput[]
    by: InscriptionGalaScalarFieldEnum[] | InscriptionGalaScalarFieldEnum
    having?: InscriptionGalaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InscriptionGalaCountAggregateInputType | true
    _avg?: InscriptionGalaAvgAggregateInputType
    _sum?: InscriptionGalaSumAggregateInputType
    _min?: InscriptionGalaMinAggregateInputType
    _max?: InscriptionGalaMaxAggregateInputType
  }

  export type InscriptionGalaGroupByOutputType = {
    id: number
    userId: number
    categorie: $Enums.CategorieInscription
    nombreInvites: number
    montantTotal: number
    statutPaiement: $Enums.StatutPaiement
    referencePaiement: string | null
    ticketCode: string | null
    qrToken: string | null
    checkedInAt: Date | null
    checkedInById: number | null
    createdAt: Date
    _count: InscriptionGalaCountAggregateOutputType | null
    _avg: InscriptionGalaAvgAggregateOutputType | null
    _sum: InscriptionGalaSumAggregateOutputType | null
    _min: InscriptionGalaMinAggregateOutputType | null
    _max: InscriptionGalaMaxAggregateOutputType | null
  }

  type GetInscriptionGalaGroupByPayload<T extends InscriptionGalaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InscriptionGalaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InscriptionGalaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InscriptionGalaGroupByOutputType[P]>
            : GetScalarType<T[P], InscriptionGalaGroupByOutputType[P]>
        }
      >
    >


  export type InscriptionGalaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    categorie?: boolean
    nombreInvites?: boolean
    montantTotal?: boolean
    statutPaiement?: boolean
    referencePaiement?: boolean
    ticketCode?: boolean
    qrToken?: boolean
    checkedInAt?: boolean
    checkedInById?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    checkedInBy?: boolean | InscriptionGala$checkedInByArgs<ExtArgs>
  }, ExtArgs["result"]["inscriptionGala"]>


  export type InscriptionGalaSelectScalar = {
    id?: boolean
    userId?: boolean
    categorie?: boolean
    nombreInvites?: boolean
    montantTotal?: boolean
    statutPaiement?: boolean
    referencePaiement?: boolean
    ticketCode?: boolean
    qrToken?: boolean
    checkedInAt?: boolean
    checkedInById?: boolean
    createdAt?: boolean
  }

  export type InscriptionGalaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    checkedInBy?: boolean | InscriptionGala$checkedInByArgs<ExtArgs>
  }

  export type $InscriptionGalaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InscriptionGala"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      checkedInBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      categorie: $Enums.CategorieInscription
      nombreInvites: number
      montantTotal: number
      statutPaiement: $Enums.StatutPaiement
      referencePaiement: string | null
      ticketCode: string | null
      qrToken: string | null
      checkedInAt: Date | null
      checkedInById: number | null
      createdAt: Date
    }, ExtArgs["result"]["inscriptionGala"]>
    composites: {}
  }

  type InscriptionGalaGetPayload<S extends boolean | null | undefined | InscriptionGalaDefaultArgs> = $Result.GetResult<Prisma.$InscriptionGalaPayload, S>

  type InscriptionGalaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InscriptionGalaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InscriptionGalaCountAggregateInputType | true
    }

  export interface InscriptionGalaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InscriptionGala'], meta: { name: 'InscriptionGala' } }
    /**
     * Find zero or one InscriptionGala that matches the filter.
     * @param {InscriptionGalaFindUniqueArgs} args - Arguments to find a InscriptionGala
     * @example
     * // Get one InscriptionGala
     * const inscriptionGala = await prisma.inscriptionGala.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InscriptionGalaFindUniqueArgs>(args: SelectSubset<T, InscriptionGalaFindUniqueArgs<ExtArgs>>): Prisma__InscriptionGalaClient<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InscriptionGala that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InscriptionGalaFindUniqueOrThrowArgs} args - Arguments to find a InscriptionGala
     * @example
     * // Get one InscriptionGala
     * const inscriptionGala = await prisma.inscriptionGala.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InscriptionGalaFindUniqueOrThrowArgs>(args: SelectSubset<T, InscriptionGalaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InscriptionGalaClient<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InscriptionGala that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionGalaFindFirstArgs} args - Arguments to find a InscriptionGala
     * @example
     * // Get one InscriptionGala
     * const inscriptionGala = await prisma.inscriptionGala.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InscriptionGalaFindFirstArgs>(args?: SelectSubset<T, InscriptionGalaFindFirstArgs<ExtArgs>>): Prisma__InscriptionGalaClient<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InscriptionGala that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionGalaFindFirstOrThrowArgs} args - Arguments to find a InscriptionGala
     * @example
     * // Get one InscriptionGala
     * const inscriptionGala = await prisma.inscriptionGala.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InscriptionGalaFindFirstOrThrowArgs>(args?: SelectSubset<T, InscriptionGalaFindFirstOrThrowArgs<ExtArgs>>): Prisma__InscriptionGalaClient<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InscriptionGalas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionGalaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InscriptionGalas
     * const inscriptionGalas = await prisma.inscriptionGala.findMany()
     * 
     * // Get first 10 InscriptionGalas
     * const inscriptionGalas = await prisma.inscriptionGala.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inscriptionGalaWithIdOnly = await prisma.inscriptionGala.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InscriptionGalaFindManyArgs>(args?: SelectSubset<T, InscriptionGalaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InscriptionGala.
     * @param {InscriptionGalaCreateArgs} args - Arguments to create a InscriptionGala.
     * @example
     * // Create one InscriptionGala
     * const InscriptionGala = await prisma.inscriptionGala.create({
     *   data: {
     *     // ... data to create a InscriptionGala
     *   }
     * })
     * 
     */
    create<T extends InscriptionGalaCreateArgs>(args: SelectSubset<T, InscriptionGalaCreateArgs<ExtArgs>>): Prisma__InscriptionGalaClient<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InscriptionGalas.
     * @param {InscriptionGalaCreateManyArgs} args - Arguments to create many InscriptionGalas.
     * @example
     * // Create many InscriptionGalas
     * const inscriptionGala = await prisma.inscriptionGala.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InscriptionGalaCreateManyArgs>(args?: SelectSubset<T, InscriptionGalaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InscriptionGala.
     * @param {InscriptionGalaDeleteArgs} args - Arguments to delete one InscriptionGala.
     * @example
     * // Delete one InscriptionGala
     * const InscriptionGala = await prisma.inscriptionGala.delete({
     *   where: {
     *     // ... filter to delete one InscriptionGala
     *   }
     * })
     * 
     */
    delete<T extends InscriptionGalaDeleteArgs>(args: SelectSubset<T, InscriptionGalaDeleteArgs<ExtArgs>>): Prisma__InscriptionGalaClient<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InscriptionGala.
     * @param {InscriptionGalaUpdateArgs} args - Arguments to update one InscriptionGala.
     * @example
     * // Update one InscriptionGala
     * const inscriptionGala = await prisma.inscriptionGala.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InscriptionGalaUpdateArgs>(args: SelectSubset<T, InscriptionGalaUpdateArgs<ExtArgs>>): Prisma__InscriptionGalaClient<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InscriptionGalas.
     * @param {InscriptionGalaDeleteManyArgs} args - Arguments to filter InscriptionGalas to delete.
     * @example
     * // Delete a few InscriptionGalas
     * const { count } = await prisma.inscriptionGala.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InscriptionGalaDeleteManyArgs>(args?: SelectSubset<T, InscriptionGalaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InscriptionGalas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionGalaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InscriptionGalas
     * const inscriptionGala = await prisma.inscriptionGala.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InscriptionGalaUpdateManyArgs>(args: SelectSubset<T, InscriptionGalaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InscriptionGala.
     * @param {InscriptionGalaUpsertArgs} args - Arguments to update or create a InscriptionGala.
     * @example
     * // Update or create a InscriptionGala
     * const inscriptionGala = await prisma.inscriptionGala.upsert({
     *   create: {
     *     // ... data to create a InscriptionGala
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InscriptionGala we want to update
     *   }
     * })
     */
    upsert<T extends InscriptionGalaUpsertArgs>(args: SelectSubset<T, InscriptionGalaUpsertArgs<ExtArgs>>): Prisma__InscriptionGalaClient<$Result.GetResult<Prisma.$InscriptionGalaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InscriptionGalas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionGalaCountArgs} args - Arguments to filter InscriptionGalas to count.
     * @example
     * // Count the number of InscriptionGalas
     * const count = await prisma.inscriptionGala.count({
     *   where: {
     *     // ... the filter for the InscriptionGalas we want to count
     *   }
     * })
    **/
    count<T extends InscriptionGalaCountArgs>(
      args?: Subset<T, InscriptionGalaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InscriptionGalaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InscriptionGala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionGalaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InscriptionGalaAggregateArgs>(args: Subset<T, InscriptionGalaAggregateArgs>): Prisma.PrismaPromise<GetInscriptionGalaAggregateType<T>>

    /**
     * Group by InscriptionGala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionGalaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InscriptionGalaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InscriptionGalaGroupByArgs['orderBy'] }
        : { orderBy?: InscriptionGalaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InscriptionGalaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInscriptionGalaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InscriptionGala model
   */
  readonly fields: InscriptionGalaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InscriptionGala.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InscriptionGalaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    checkedInBy<T extends InscriptionGala$checkedInByArgs<ExtArgs> = {}>(args?: Subset<T, InscriptionGala$checkedInByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InscriptionGala model
   */ 
  interface InscriptionGalaFieldRefs {
    readonly id: FieldRef<"InscriptionGala", 'Int'>
    readonly userId: FieldRef<"InscriptionGala", 'Int'>
    readonly categorie: FieldRef<"InscriptionGala", 'CategorieInscription'>
    readonly nombreInvites: FieldRef<"InscriptionGala", 'Int'>
    readonly montantTotal: FieldRef<"InscriptionGala", 'Int'>
    readonly statutPaiement: FieldRef<"InscriptionGala", 'StatutPaiement'>
    readonly referencePaiement: FieldRef<"InscriptionGala", 'String'>
    readonly ticketCode: FieldRef<"InscriptionGala", 'String'>
    readonly qrToken: FieldRef<"InscriptionGala", 'String'>
    readonly checkedInAt: FieldRef<"InscriptionGala", 'DateTime'>
    readonly checkedInById: FieldRef<"InscriptionGala", 'Int'>
    readonly createdAt: FieldRef<"InscriptionGala", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InscriptionGala findUnique
   */
  export type InscriptionGalaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * Filter, which InscriptionGala to fetch.
     */
    where: InscriptionGalaWhereUniqueInput
  }

  /**
   * InscriptionGala findUniqueOrThrow
   */
  export type InscriptionGalaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * Filter, which InscriptionGala to fetch.
     */
    where: InscriptionGalaWhereUniqueInput
  }

  /**
   * InscriptionGala findFirst
   */
  export type InscriptionGalaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * Filter, which InscriptionGala to fetch.
     */
    where?: InscriptionGalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InscriptionGalas to fetch.
     */
    orderBy?: InscriptionGalaOrderByWithRelationInput | InscriptionGalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InscriptionGalas.
     */
    cursor?: InscriptionGalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InscriptionGalas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InscriptionGalas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InscriptionGalas.
     */
    distinct?: InscriptionGalaScalarFieldEnum | InscriptionGalaScalarFieldEnum[]
  }

  /**
   * InscriptionGala findFirstOrThrow
   */
  export type InscriptionGalaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * Filter, which InscriptionGala to fetch.
     */
    where?: InscriptionGalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InscriptionGalas to fetch.
     */
    orderBy?: InscriptionGalaOrderByWithRelationInput | InscriptionGalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InscriptionGalas.
     */
    cursor?: InscriptionGalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InscriptionGalas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InscriptionGalas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InscriptionGalas.
     */
    distinct?: InscriptionGalaScalarFieldEnum | InscriptionGalaScalarFieldEnum[]
  }

  /**
   * InscriptionGala findMany
   */
  export type InscriptionGalaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * Filter, which InscriptionGalas to fetch.
     */
    where?: InscriptionGalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InscriptionGalas to fetch.
     */
    orderBy?: InscriptionGalaOrderByWithRelationInput | InscriptionGalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InscriptionGalas.
     */
    cursor?: InscriptionGalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InscriptionGalas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InscriptionGalas.
     */
    skip?: number
    distinct?: InscriptionGalaScalarFieldEnum | InscriptionGalaScalarFieldEnum[]
  }

  /**
   * InscriptionGala create
   */
  export type InscriptionGalaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * The data needed to create a InscriptionGala.
     */
    data: XOR<InscriptionGalaCreateInput, InscriptionGalaUncheckedCreateInput>
  }

  /**
   * InscriptionGala createMany
   */
  export type InscriptionGalaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InscriptionGalas.
     */
    data: InscriptionGalaCreateManyInput | InscriptionGalaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InscriptionGala update
   */
  export type InscriptionGalaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * The data needed to update a InscriptionGala.
     */
    data: XOR<InscriptionGalaUpdateInput, InscriptionGalaUncheckedUpdateInput>
    /**
     * Choose, which InscriptionGala to update.
     */
    where: InscriptionGalaWhereUniqueInput
  }

  /**
   * InscriptionGala updateMany
   */
  export type InscriptionGalaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InscriptionGalas.
     */
    data: XOR<InscriptionGalaUpdateManyMutationInput, InscriptionGalaUncheckedUpdateManyInput>
    /**
     * Filter which InscriptionGalas to update
     */
    where?: InscriptionGalaWhereInput
  }

  /**
   * InscriptionGala upsert
   */
  export type InscriptionGalaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * The filter to search for the InscriptionGala to update in case it exists.
     */
    where: InscriptionGalaWhereUniqueInput
    /**
     * In case the InscriptionGala found by the `where` argument doesn't exist, create a new InscriptionGala with this data.
     */
    create: XOR<InscriptionGalaCreateInput, InscriptionGalaUncheckedCreateInput>
    /**
     * In case the InscriptionGala was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InscriptionGalaUpdateInput, InscriptionGalaUncheckedUpdateInput>
  }

  /**
   * InscriptionGala delete
   */
  export type InscriptionGalaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
    /**
     * Filter which InscriptionGala to delete.
     */
    where: InscriptionGalaWhereUniqueInput
  }

  /**
   * InscriptionGala deleteMany
   */
  export type InscriptionGalaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InscriptionGalas to delete
     */
    where?: InscriptionGalaWhereInput
  }

  /**
   * InscriptionGala.checkedInBy
   */
  export type InscriptionGala$checkedInByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * InscriptionGala without action
   */
  export type InscriptionGalaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionGala
     */
    select?: InscriptionGalaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionGalaInclude<ExtArgs> | null
  }


  /**
   * Model BilletTombola
   */

  export type AggregateBilletTombola = {
    _count: BilletTombolaCountAggregateOutputType | null
    _avg: BilletTombolaAvgAggregateOutputType | null
    _sum: BilletTombolaSumAggregateOutputType | null
    _min: BilletTombolaMinAggregateOutputType | null
    _max: BilletTombolaMaxAggregateOutputType | null
  }

  export type BilletTombolaAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    quantite: number | null
    montant: number | null
  }

  export type BilletTombolaSumAggregateOutputType = {
    id: number | null
    userId: number | null
    quantite: number | null
    montant: number | null
  }

  export type BilletTombolaMinAggregateOutputType = {
    id: number | null
    userId: number | null
    numeroBillet: string | null
    quantite: number | null
    montant: number | null
    statutPaiement: $Enums.StatutPaiement | null
    referencePaiement: string | null
    createdAt: Date | null
  }

  export type BilletTombolaMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    numeroBillet: string | null
    quantite: number | null
    montant: number | null
    statutPaiement: $Enums.StatutPaiement | null
    referencePaiement: string | null
    createdAt: Date | null
  }

  export type BilletTombolaCountAggregateOutputType = {
    id: number
    userId: number
    numeroBillet: number
    quantite: number
    montant: number
    statutPaiement: number
    referencePaiement: number
    createdAt: number
    _all: number
  }


  export type BilletTombolaAvgAggregateInputType = {
    id?: true
    userId?: true
    quantite?: true
    montant?: true
  }

  export type BilletTombolaSumAggregateInputType = {
    id?: true
    userId?: true
    quantite?: true
    montant?: true
  }

  export type BilletTombolaMinAggregateInputType = {
    id?: true
    userId?: true
    numeroBillet?: true
    quantite?: true
    montant?: true
    statutPaiement?: true
    referencePaiement?: true
    createdAt?: true
  }

  export type BilletTombolaMaxAggregateInputType = {
    id?: true
    userId?: true
    numeroBillet?: true
    quantite?: true
    montant?: true
    statutPaiement?: true
    referencePaiement?: true
    createdAt?: true
  }

  export type BilletTombolaCountAggregateInputType = {
    id?: true
    userId?: true
    numeroBillet?: true
    quantite?: true
    montant?: true
    statutPaiement?: true
    referencePaiement?: true
    createdAt?: true
    _all?: true
  }

  export type BilletTombolaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BilletTombola to aggregate.
     */
    where?: BilletTombolaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BilletTombolas to fetch.
     */
    orderBy?: BilletTombolaOrderByWithRelationInput | BilletTombolaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BilletTombolaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BilletTombolas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BilletTombolas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BilletTombolas
    **/
    _count?: true | BilletTombolaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BilletTombolaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BilletTombolaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BilletTombolaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BilletTombolaMaxAggregateInputType
  }

  export type GetBilletTombolaAggregateType<T extends BilletTombolaAggregateArgs> = {
        [P in keyof T & keyof AggregateBilletTombola]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBilletTombola[P]>
      : GetScalarType<T[P], AggregateBilletTombola[P]>
  }




  export type BilletTombolaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BilletTombolaWhereInput
    orderBy?: BilletTombolaOrderByWithAggregationInput | BilletTombolaOrderByWithAggregationInput[]
    by: BilletTombolaScalarFieldEnum[] | BilletTombolaScalarFieldEnum
    having?: BilletTombolaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BilletTombolaCountAggregateInputType | true
    _avg?: BilletTombolaAvgAggregateInputType
    _sum?: BilletTombolaSumAggregateInputType
    _min?: BilletTombolaMinAggregateInputType
    _max?: BilletTombolaMaxAggregateInputType
  }

  export type BilletTombolaGroupByOutputType = {
    id: number
    userId: number
    numeroBillet: string
    quantite: number
    montant: number
    statutPaiement: $Enums.StatutPaiement
    referencePaiement: string | null
    createdAt: Date
    _count: BilletTombolaCountAggregateOutputType | null
    _avg: BilletTombolaAvgAggregateOutputType | null
    _sum: BilletTombolaSumAggregateOutputType | null
    _min: BilletTombolaMinAggregateOutputType | null
    _max: BilletTombolaMaxAggregateOutputType | null
  }

  type GetBilletTombolaGroupByPayload<T extends BilletTombolaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BilletTombolaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BilletTombolaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BilletTombolaGroupByOutputType[P]>
            : GetScalarType<T[P], BilletTombolaGroupByOutputType[P]>
        }
      >
    >


  export type BilletTombolaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    numeroBillet?: boolean
    quantite?: boolean
    montant?: boolean
    statutPaiement?: boolean
    referencePaiement?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billetTombola"]>


  export type BilletTombolaSelectScalar = {
    id?: boolean
    userId?: boolean
    numeroBillet?: boolean
    quantite?: boolean
    montant?: boolean
    statutPaiement?: boolean
    referencePaiement?: boolean
    createdAt?: boolean
  }

  export type BilletTombolaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BilletTombolaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BilletTombola"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      numeroBillet: string
      quantite: number
      montant: number
      statutPaiement: $Enums.StatutPaiement
      referencePaiement: string | null
      createdAt: Date
    }, ExtArgs["result"]["billetTombola"]>
    composites: {}
  }

  type BilletTombolaGetPayload<S extends boolean | null | undefined | BilletTombolaDefaultArgs> = $Result.GetResult<Prisma.$BilletTombolaPayload, S>

  type BilletTombolaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BilletTombolaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BilletTombolaCountAggregateInputType | true
    }

  export interface BilletTombolaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BilletTombola'], meta: { name: 'BilletTombola' } }
    /**
     * Find zero or one BilletTombola that matches the filter.
     * @param {BilletTombolaFindUniqueArgs} args - Arguments to find a BilletTombola
     * @example
     * // Get one BilletTombola
     * const billetTombola = await prisma.billetTombola.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BilletTombolaFindUniqueArgs>(args: SelectSubset<T, BilletTombolaFindUniqueArgs<ExtArgs>>): Prisma__BilletTombolaClient<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BilletTombola that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BilletTombolaFindUniqueOrThrowArgs} args - Arguments to find a BilletTombola
     * @example
     * // Get one BilletTombola
     * const billetTombola = await prisma.billetTombola.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BilletTombolaFindUniqueOrThrowArgs>(args: SelectSubset<T, BilletTombolaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BilletTombolaClient<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BilletTombola that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilletTombolaFindFirstArgs} args - Arguments to find a BilletTombola
     * @example
     * // Get one BilletTombola
     * const billetTombola = await prisma.billetTombola.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BilletTombolaFindFirstArgs>(args?: SelectSubset<T, BilletTombolaFindFirstArgs<ExtArgs>>): Prisma__BilletTombolaClient<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BilletTombola that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilletTombolaFindFirstOrThrowArgs} args - Arguments to find a BilletTombola
     * @example
     * // Get one BilletTombola
     * const billetTombola = await prisma.billetTombola.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BilletTombolaFindFirstOrThrowArgs>(args?: SelectSubset<T, BilletTombolaFindFirstOrThrowArgs<ExtArgs>>): Prisma__BilletTombolaClient<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BilletTombolas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilletTombolaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BilletTombolas
     * const billetTombolas = await prisma.billetTombola.findMany()
     * 
     * // Get first 10 BilletTombolas
     * const billetTombolas = await prisma.billetTombola.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billetTombolaWithIdOnly = await prisma.billetTombola.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BilletTombolaFindManyArgs>(args?: SelectSubset<T, BilletTombolaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BilletTombola.
     * @param {BilletTombolaCreateArgs} args - Arguments to create a BilletTombola.
     * @example
     * // Create one BilletTombola
     * const BilletTombola = await prisma.billetTombola.create({
     *   data: {
     *     // ... data to create a BilletTombola
     *   }
     * })
     * 
     */
    create<T extends BilletTombolaCreateArgs>(args: SelectSubset<T, BilletTombolaCreateArgs<ExtArgs>>): Prisma__BilletTombolaClient<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BilletTombolas.
     * @param {BilletTombolaCreateManyArgs} args - Arguments to create many BilletTombolas.
     * @example
     * // Create many BilletTombolas
     * const billetTombola = await prisma.billetTombola.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BilletTombolaCreateManyArgs>(args?: SelectSubset<T, BilletTombolaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BilletTombola.
     * @param {BilletTombolaDeleteArgs} args - Arguments to delete one BilletTombola.
     * @example
     * // Delete one BilletTombola
     * const BilletTombola = await prisma.billetTombola.delete({
     *   where: {
     *     // ... filter to delete one BilletTombola
     *   }
     * })
     * 
     */
    delete<T extends BilletTombolaDeleteArgs>(args: SelectSubset<T, BilletTombolaDeleteArgs<ExtArgs>>): Prisma__BilletTombolaClient<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BilletTombola.
     * @param {BilletTombolaUpdateArgs} args - Arguments to update one BilletTombola.
     * @example
     * // Update one BilletTombola
     * const billetTombola = await prisma.billetTombola.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BilletTombolaUpdateArgs>(args: SelectSubset<T, BilletTombolaUpdateArgs<ExtArgs>>): Prisma__BilletTombolaClient<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BilletTombolas.
     * @param {BilletTombolaDeleteManyArgs} args - Arguments to filter BilletTombolas to delete.
     * @example
     * // Delete a few BilletTombolas
     * const { count } = await prisma.billetTombola.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BilletTombolaDeleteManyArgs>(args?: SelectSubset<T, BilletTombolaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BilletTombolas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilletTombolaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BilletTombolas
     * const billetTombola = await prisma.billetTombola.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BilletTombolaUpdateManyArgs>(args: SelectSubset<T, BilletTombolaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BilletTombola.
     * @param {BilletTombolaUpsertArgs} args - Arguments to update or create a BilletTombola.
     * @example
     * // Update or create a BilletTombola
     * const billetTombola = await prisma.billetTombola.upsert({
     *   create: {
     *     // ... data to create a BilletTombola
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BilletTombola we want to update
     *   }
     * })
     */
    upsert<T extends BilletTombolaUpsertArgs>(args: SelectSubset<T, BilletTombolaUpsertArgs<ExtArgs>>): Prisma__BilletTombolaClient<$Result.GetResult<Prisma.$BilletTombolaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BilletTombolas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilletTombolaCountArgs} args - Arguments to filter BilletTombolas to count.
     * @example
     * // Count the number of BilletTombolas
     * const count = await prisma.billetTombola.count({
     *   where: {
     *     // ... the filter for the BilletTombolas we want to count
     *   }
     * })
    **/
    count<T extends BilletTombolaCountArgs>(
      args?: Subset<T, BilletTombolaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BilletTombolaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BilletTombola.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilletTombolaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BilletTombolaAggregateArgs>(args: Subset<T, BilletTombolaAggregateArgs>): Prisma.PrismaPromise<GetBilletTombolaAggregateType<T>>

    /**
     * Group by BilletTombola.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilletTombolaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BilletTombolaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BilletTombolaGroupByArgs['orderBy'] }
        : { orderBy?: BilletTombolaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BilletTombolaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBilletTombolaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BilletTombola model
   */
  readonly fields: BilletTombolaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BilletTombola.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BilletTombolaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BilletTombola model
   */ 
  interface BilletTombolaFieldRefs {
    readonly id: FieldRef<"BilletTombola", 'Int'>
    readonly userId: FieldRef<"BilletTombola", 'Int'>
    readonly numeroBillet: FieldRef<"BilletTombola", 'String'>
    readonly quantite: FieldRef<"BilletTombola", 'Int'>
    readonly montant: FieldRef<"BilletTombola", 'Int'>
    readonly statutPaiement: FieldRef<"BilletTombola", 'StatutPaiement'>
    readonly referencePaiement: FieldRef<"BilletTombola", 'String'>
    readonly createdAt: FieldRef<"BilletTombola", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BilletTombola findUnique
   */
  export type BilletTombolaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * Filter, which BilletTombola to fetch.
     */
    where: BilletTombolaWhereUniqueInput
  }

  /**
   * BilletTombola findUniqueOrThrow
   */
  export type BilletTombolaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * Filter, which BilletTombola to fetch.
     */
    where: BilletTombolaWhereUniqueInput
  }

  /**
   * BilletTombola findFirst
   */
  export type BilletTombolaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * Filter, which BilletTombola to fetch.
     */
    where?: BilletTombolaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BilletTombolas to fetch.
     */
    orderBy?: BilletTombolaOrderByWithRelationInput | BilletTombolaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BilletTombolas.
     */
    cursor?: BilletTombolaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BilletTombolas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BilletTombolas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BilletTombolas.
     */
    distinct?: BilletTombolaScalarFieldEnum | BilletTombolaScalarFieldEnum[]
  }

  /**
   * BilletTombola findFirstOrThrow
   */
  export type BilletTombolaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * Filter, which BilletTombola to fetch.
     */
    where?: BilletTombolaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BilletTombolas to fetch.
     */
    orderBy?: BilletTombolaOrderByWithRelationInput | BilletTombolaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BilletTombolas.
     */
    cursor?: BilletTombolaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BilletTombolas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BilletTombolas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BilletTombolas.
     */
    distinct?: BilletTombolaScalarFieldEnum | BilletTombolaScalarFieldEnum[]
  }

  /**
   * BilletTombola findMany
   */
  export type BilletTombolaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * Filter, which BilletTombolas to fetch.
     */
    where?: BilletTombolaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BilletTombolas to fetch.
     */
    orderBy?: BilletTombolaOrderByWithRelationInput | BilletTombolaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BilletTombolas.
     */
    cursor?: BilletTombolaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BilletTombolas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BilletTombolas.
     */
    skip?: number
    distinct?: BilletTombolaScalarFieldEnum | BilletTombolaScalarFieldEnum[]
  }

  /**
   * BilletTombola create
   */
  export type BilletTombolaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * The data needed to create a BilletTombola.
     */
    data: XOR<BilletTombolaCreateInput, BilletTombolaUncheckedCreateInput>
  }

  /**
   * BilletTombola createMany
   */
  export type BilletTombolaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BilletTombolas.
     */
    data: BilletTombolaCreateManyInput | BilletTombolaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BilletTombola update
   */
  export type BilletTombolaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * The data needed to update a BilletTombola.
     */
    data: XOR<BilletTombolaUpdateInput, BilletTombolaUncheckedUpdateInput>
    /**
     * Choose, which BilletTombola to update.
     */
    where: BilletTombolaWhereUniqueInput
  }

  /**
   * BilletTombola updateMany
   */
  export type BilletTombolaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BilletTombolas.
     */
    data: XOR<BilletTombolaUpdateManyMutationInput, BilletTombolaUncheckedUpdateManyInput>
    /**
     * Filter which BilletTombolas to update
     */
    where?: BilletTombolaWhereInput
  }

  /**
   * BilletTombola upsert
   */
  export type BilletTombolaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * The filter to search for the BilletTombola to update in case it exists.
     */
    where: BilletTombolaWhereUniqueInput
    /**
     * In case the BilletTombola found by the `where` argument doesn't exist, create a new BilletTombola with this data.
     */
    create: XOR<BilletTombolaCreateInput, BilletTombolaUncheckedCreateInput>
    /**
     * In case the BilletTombola was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BilletTombolaUpdateInput, BilletTombolaUncheckedUpdateInput>
  }

  /**
   * BilletTombola delete
   */
  export type BilletTombolaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
    /**
     * Filter which BilletTombola to delete.
     */
    where: BilletTombolaWhereUniqueInput
  }

  /**
   * BilletTombola deleteMany
   */
  export type BilletTombolaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BilletTombolas to delete
     */
    where?: BilletTombolaWhereInput
  }

  /**
   * BilletTombola without action
   */
  export type BilletTombolaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilletTombola
     */
    select?: BilletTombolaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilletTombolaInclude<ExtArgs> | null
  }


  /**
   * Model ContactMessage
   */

  export type AggregateContactMessage = {
    _count: ContactMessageCountAggregateOutputType | null
    _avg: ContactMessageAvgAggregateOutputType | null
    _sum: ContactMessageSumAggregateOutputType | null
    _min: ContactMessageMinAggregateOutputType | null
    _max: ContactMessageMaxAggregateOutputType | null
  }

  export type ContactMessageAvgAggregateOutputType = {
    id: number | null
  }

  export type ContactMessageSumAggregateOutputType = {
    id: number | null
  }

  export type ContactMessageMinAggregateOutputType = {
    id: number | null
    nom: string | null
    email: string | null
    sujet: string | null
    message: string | null
    lu: boolean | null
    createdAt: Date | null
  }

  export type ContactMessageMaxAggregateOutputType = {
    id: number | null
    nom: string | null
    email: string | null
    sujet: string | null
    message: string | null
    lu: boolean | null
    createdAt: Date | null
  }

  export type ContactMessageCountAggregateOutputType = {
    id: number
    nom: number
    email: number
    sujet: number
    message: number
    lu: number
    createdAt: number
    _all: number
  }


  export type ContactMessageAvgAggregateInputType = {
    id?: true
  }

  export type ContactMessageSumAggregateInputType = {
    id?: true
  }

  export type ContactMessageMinAggregateInputType = {
    id?: true
    nom?: true
    email?: true
    sujet?: true
    message?: true
    lu?: true
    createdAt?: true
  }

  export type ContactMessageMaxAggregateInputType = {
    id?: true
    nom?: true
    email?: true
    sujet?: true
    message?: true
    lu?: true
    createdAt?: true
  }

  export type ContactMessageCountAggregateInputType = {
    id?: true
    nom?: true
    email?: true
    sujet?: true
    message?: true
    lu?: true
    createdAt?: true
    _all?: true
  }

  export type ContactMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactMessage to aggregate.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContactMessages
    **/
    _count?: true | ContactMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContactMessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContactMessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactMessageMaxAggregateInputType
  }

  export type GetContactMessageAggregateType<T extends ContactMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateContactMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContactMessage[P]>
      : GetScalarType<T[P], AggregateContactMessage[P]>
  }




  export type ContactMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactMessageWhereInput
    orderBy?: ContactMessageOrderByWithAggregationInput | ContactMessageOrderByWithAggregationInput[]
    by: ContactMessageScalarFieldEnum[] | ContactMessageScalarFieldEnum
    having?: ContactMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactMessageCountAggregateInputType | true
    _avg?: ContactMessageAvgAggregateInputType
    _sum?: ContactMessageSumAggregateInputType
    _min?: ContactMessageMinAggregateInputType
    _max?: ContactMessageMaxAggregateInputType
  }

  export type ContactMessageGroupByOutputType = {
    id: number
    nom: string
    email: string
    sujet: string
    message: string
    lu: boolean
    createdAt: Date
    _count: ContactMessageCountAggregateOutputType | null
    _avg: ContactMessageAvgAggregateOutputType | null
    _sum: ContactMessageSumAggregateOutputType | null
    _min: ContactMessageMinAggregateOutputType | null
    _max: ContactMessageMaxAggregateOutputType | null
  }

  type GetContactMessageGroupByPayload<T extends ContactMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ContactMessageGroupByOutputType[P]>
        }
      >
    >


  export type ContactMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nom?: boolean
    email?: boolean
    sujet?: boolean
    message?: boolean
    lu?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contactMessage"]>


  export type ContactMessageSelectScalar = {
    id?: boolean
    nom?: boolean
    email?: boolean
    sujet?: boolean
    message?: boolean
    lu?: boolean
    createdAt?: boolean
  }


  export type $ContactMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContactMessage"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nom: string
      email: string
      sujet: string
      message: string
      lu: boolean
      createdAt: Date
    }, ExtArgs["result"]["contactMessage"]>
    composites: {}
  }

  type ContactMessageGetPayload<S extends boolean | null | undefined | ContactMessageDefaultArgs> = $Result.GetResult<Prisma.$ContactMessagePayload, S>

  type ContactMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ContactMessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ContactMessageCountAggregateInputType | true
    }

  export interface ContactMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContactMessage'], meta: { name: 'ContactMessage' } }
    /**
     * Find zero or one ContactMessage that matches the filter.
     * @param {ContactMessageFindUniqueArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactMessageFindUniqueArgs>(args: SelectSubset<T, ContactMessageFindUniqueArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ContactMessage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ContactMessageFindUniqueOrThrowArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ContactMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindFirstArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactMessageFindFirstArgs>(args?: SelectSubset<T, ContactMessageFindFirstArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ContactMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindFirstOrThrowArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ContactMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContactMessages
     * const contactMessages = await prisma.contactMessage.findMany()
     * 
     * // Get first 10 ContactMessages
     * const contactMessages = await prisma.contactMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactMessageWithIdOnly = await prisma.contactMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactMessageFindManyArgs>(args?: SelectSubset<T, ContactMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ContactMessage.
     * @param {ContactMessageCreateArgs} args - Arguments to create a ContactMessage.
     * @example
     * // Create one ContactMessage
     * const ContactMessage = await prisma.contactMessage.create({
     *   data: {
     *     // ... data to create a ContactMessage
     *   }
     * })
     * 
     */
    create<T extends ContactMessageCreateArgs>(args: SelectSubset<T, ContactMessageCreateArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ContactMessages.
     * @param {ContactMessageCreateManyArgs} args - Arguments to create many ContactMessages.
     * @example
     * // Create many ContactMessages
     * const contactMessage = await prisma.contactMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactMessageCreateManyArgs>(args?: SelectSubset<T, ContactMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ContactMessage.
     * @param {ContactMessageDeleteArgs} args - Arguments to delete one ContactMessage.
     * @example
     * // Delete one ContactMessage
     * const ContactMessage = await prisma.contactMessage.delete({
     *   where: {
     *     // ... filter to delete one ContactMessage
     *   }
     * })
     * 
     */
    delete<T extends ContactMessageDeleteArgs>(args: SelectSubset<T, ContactMessageDeleteArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ContactMessage.
     * @param {ContactMessageUpdateArgs} args - Arguments to update one ContactMessage.
     * @example
     * // Update one ContactMessage
     * const contactMessage = await prisma.contactMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactMessageUpdateArgs>(args: SelectSubset<T, ContactMessageUpdateArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ContactMessages.
     * @param {ContactMessageDeleteManyArgs} args - Arguments to filter ContactMessages to delete.
     * @example
     * // Delete a few ContactMessages
     * const { count } = await prisma.contactMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactMessageDeleteManyArgs>(args?: SelectSubset<T, ContactMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContactMessages
     * const contactMessage = await prisma.contactMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactMessageUpdateManyArgs>(args: SelectSubset<T, ContactMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ContactMessage.
     * @param {ContactMessageUpsertArgs} args - Arguments to update or create a ContactMessage.
     * @example
     * // Update or create a ContactMessage
     * const contactMessage = await prisma.contactMessage.upsert({
     *   create: {
     *     // ... data to create a ContactMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContactMessage we want to update
     *   }
     * })
     */
    upsert<T extends ContactMessageUpsertArgs>(args: SelectSubset<T, ContactMessageUpsertArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ContactMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageCountArgs} args - Arguments to filter ContactMessages to count.
     * @example
     * // Count the number of ContactMessages
     * const count = await prisma.contactMessage.count({
     *   where: {
     *     // ... the filter for the ContactMessages we want to count
     *   }
     * })
    **/
    count<T extends ContactMessageCountArgs>(
      args?: Subset<T, ContactMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContactMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContactMessageAggregateArgs>(args: Subset<T, ContactMessageAggregateArgs>): Prisma.PrismaPromise<GetContactMessageAggregateType<T>>

    /**
     * Group by ContactMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContactMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactMessageGroupByArgs['orderBy'] }
        : { orderBy?: ContactMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContactMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContactMessage model
   */
  readonly fields: ContactMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContactMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContactMessage model
   */ 
  interface ContactMessageFieldRefs {
    readonly id: FieldRef<"ContactMessage", 'Int'>
    readonly nom: FieldRef<"ContactMessage", 'String'>
    readonly email: FieldRef<"ContactMessage", 'String'>
    readonly sujet: FieldRef<"ContactMessage", 'String'>
    readonly message: FieldRef<"ContactMessage", 'String'>
    readonly lu: FieldRef<"ContactMessage", 'Boolean'>
    readonly createdAt: FieldRef<"ContactMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContactMessage findUnique
   */
  export type ContactMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage findUniqueOrThrow
   */
  export type ContactMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage findFirst
   */
  export type ContactMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactMessages.
     */
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage findFirstOrThrow
   */
  export type ContactMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactMessages.
     */
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage findMany
   */
  export type ContactMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Filter, which ContactMessages to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage create
   */
  export type ContactMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * The data needed to create a ContactMessage.
     */
    data: XOR<ContactMessageCreateInput, ContactMessageUncheckedCreateInput>
  }

  /**
   * ContactMessage createMany
   */
  export type ContactMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContactMessages.
     */
    data: ContactMessageCreateManyInput | ContactMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactMessage update
   */
  export type ContactMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * The data needed to update a ContactMessage.
     */
    data: XOR<ContactMessageUpdateInput, ContactMessageUncheckedUpdateInput>
    /**
     * Choose, which ContactMessage to update.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage updateMany
   */
  export type ContactMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContactMessages.
     */
    data: XOR<ContactMessageUpdateManyMutationInput, ContactMessageUncheckedUpdateManyInput>
    /**
     * Filter which ContactMessages to update
     */
    where?: ContactMessageWhereInput
  }

  /**
   * ContactMessage upsert
   */
  export type ContactMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * The filter to search for the ContactMessage to update in case it exists.
     */
    where: ContactMessageWhereUniqueInput
    /**
     * In case the ContactMessage found by the `where` argument doesn't exist, create a new ContactMessage with this data.
     */
    create: XOR<ContactMessageCreateInput, ContactMessageUncheckedCreateInput>
    /**
     * In case the ContactMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactMessageUpdateInput, ContactMessageUncheckedUpdateInput>
  }

  /**
   * ContactMessage delete
   */
  export type ContactMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Filter which ContactMessage to delete.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage deleteMany
   */
  export type ContactMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactMessages to delete
     */
    where?: ContactMessageWhereInput
  }

  /**
   * ContactMessage without action
   */
  export type ContactMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    nom: 'nom',
    prenom: 'prenom',
    telephone: 'telephone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const EventSettingScalarFieldEnum: {
    id: 'id',
    key: 'key',
    title: 'title',
    subtitle: 'subtitle',
    description: 'description',
    location: 'location',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    isPublished: 'isPublished',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventSettingScalarFieldEnum = (typeof EventSettingScalarFieldEnum)[keyof typeof EventSettingScalarFieldEnum]


  export const PasswordResetScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    token: 'token',
    code: 'code',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type PasswordResetScalarFieldEnum = (typeof PasswordResetScalarFieldEnum)[keyof typeof PasswordResetScalarFieldEnum]


  export const InscriptionGalaScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    categorie: 'categorie',
    nombreInvites: 'nombreInvites',
    montantTotal: 'montantTotal',
    statutPaiement: 'statutPaiement',
    referencePaiement: 'referencePaiement',
    ticketCode: 'ticketCode',
    qrToken: 'qrToken',
    checkedInAt: 'checkedInAt',
    checkedInById: 'checkedInById',
    createdAt: 'createdAt'
  };

  export type InscriptionGalaScalarFieldEnum = (typeof InscriptionGalaScalarFieldEnum)[keyof typeof InscriptionGalaScalarFieldEnum]


  export const BilletTombolaScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    numeroBillet: 'numeroBillet',
    quantite: 'quantite',
    montant: 'montant',
    statutPaiement: 'statutPaiement',
    referencePaiement: 'referencePaiement',
    createdAt: 'createdAt'
  };

  export type BilletTombolaScalarFieldEnum = (typeof BilletTombolaScalarFieldEnum)[keyof typeof BilletTombolaScalarFieldEnum]


  export const ContactMessageScalarFieldEnum: {
    id: 'id',
    nom: 'nom',
    email: 'email',
    sujet: 'sujet',
    message: 'message',
    lu: 'lu',
    createdAt: 'createdAt'
  };

  export type ContactMessageScalarFieldEnum = (typeof ContactMessageScalarFieldEnum)[keyof typeof ContactMessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'CategorieInscription'
   */
  export type EnumCategorieInscriptionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CategorieInscription'>
    


  /**
   * Reference to a field of type 'StatutPaiement'
   */
  export type EnumStatutPaiementFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatutPaiement'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    nom?: StringFilter<"User"> | string
    prenom?: StringFilter<"User"> | string
    telephone?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    inscriptionsGala?: InscriptionGalaListRelationFilter
    scannedInscriptions?: InscriptionGalaListRelationFilter
    billetsTombola?: BilletTombolaListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    telephone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    inscriptionsGala?: InscriptionGalaOrderByRelationAggregateInput
    scannedInscriptions?: InscriptionGalaOrderByRelationAggregateInput
    billetsTombola?: BilletTombolaOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    nom?: StringFilter<"User"> | string
    prenom?: StringFilter<"User"> | string
    telephone?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    inscriptionsGala?: InscriptionGalaListRelationFilter
    scannedInscriptions?: InscriptionGalaListRelationFilter
    billetsTombola?: BilletTombolaListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    telephone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    nom?: StringWithAggregatesFilter<"User"> | string
    prenom?: StringWithAggregatesFilter<"User"> | string
    telephone?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type EventSettingWhereInput = {
    AND?: EventSettingWhereInput | EventSettingWhereInput[]
    OR?: EventSettingWhereInput[]
    NOT?: EventSettingWhereInput | EventSettingWhereInput[]
    id?: IntFilter<"EventSetting"> | number
    key?: StringFilter<"EventSetting"> | string
    title?: StringFilter<"EventSetting"> | string
    subtitle?: StringNullableFilter<"EventSetting"> | string | null
    description?: StringNullableFilter<"EventSetting"> | string | null
    location?: StringNullableFilter<"EventSetting"> | string | null
    startsAt?: DateTimeNullableFilter<"EventSetting"> | Date | string | null
    endsAt?: DateTimeNullableFilter<"EventSetting"> | Date | string | null
    isPublished?: BoolFilter<"EventSetting"> | boolean
    createdAt?: DateTimeFilter<"EventSetting"> | Date | string
    updatedAt?: DateTimeFilter<"EventSetting"> | Date | string
  }

  export type EventSettingOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    title?: SortOrder
    subtitle?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    startsAt?: SortOrderInput | SortOrder
    endsAt?: SortOrderInput | SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    key?: string
    AND?: EventSettingWhereInput | EventSettingWhereInput[]
    OR?: EventSettingWhereInput[]
    NOT?: EventSettingWhereInput | EventSettingWhereInput[]
    title?: StringFilter<"EventSetting"> | string
    subtitle?: StringNullableFilter<"EventSetting"> | string | null
    description?: StringNullableFilter<"EventSetting"> | string | null
    location?: StringNullableFilter<"EventSetting"> | string | null
    startsAt?: DateTimeNullableFilter<"EventSetting"> | Date | string | null
    endsAt?: DateTimeNullableFilter<"EventSetting"> | Date | string | null
    isPublished?: BoolFilter<"EventSetting"> | boolean
    createdAt?: DateTimeFilter<"EventSetting"> | Date | string
    updatedAt?: DateTimeFilter<"EventSetting"> | Date | string
  }, "id" | "key">

  export type EventSettingOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    title?: SortOrder
    subtitle?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    startsAt?: SortOrderInput | SortOrder
    endsAt?: SortOrderInput | SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventSettingCountOrderByAggregateInput
    _avg?: EventSettingAvgOrderByAggregateInput
    _max?: EventSettingMaxOrderByAggregateInput
    _min?: EventSettingMinOrderByAggregateInput
    _sum?: EventSettingSumOrderByAggregateInput
  }

  export type EventSettingScalarWhereWithAggregatesInput = {
    AND?: EventSettingScalarWhereWithAggregatesInput | EventSettingScalarWhereWithAggregatesInput[]
    OR?: EventSettingScalarWhereWithAggregatesInput[]
    NOT?: EventSettingScalarWhereWithAggregatesInput | EventSettingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EventSetting"> | number
    key?: StringWithAggregatesFilter<"EventSetting"> | string
    title?: StringWithAggregatesFilter<"EventSetting"> | string
    subtitle?: StringNullableWithAggregatesFilter<"EventSetting"> | string | null
    description?: StringNullableWithAggregatesFilter<"EventSetting"> | string | null
    location?: StringNullableWithAggregatesFilter<"EventSetting"> | string | null
    startsAt?: DateTimeNullableWithAggregatesFilter<"EventSetting"> | Date | string | null
    endsAt?: DateTimeNullableWithAggregatesFilter<"EventSetting"> | Date | string | null
    isPublished?: BoolWithAggregatesFilter<"EventSetting"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"EventSetting"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EventSetting"> | Date | string
  }

  export type PasswordResetWhereInput = {
    AND?: PasswordResetWhereInput | PasswordResetWhereInput[]
    OR?: PasswordResetWhereInput[]
    NOT?: PasswordResetWhereInput | PasswordResetWhereInput[]
    id?: IntFilter<"PasswordReset"> | number
    identifier?: StringFilter<"PasswordReset"> | string
    token?: StringNullableFilter<"PasswordReset"> | string | null
    code?: StringNullableFilter<"PasswordReset"> | string | null
    expiresAt?: DateTimeFilter<"PasswordReset"> | Date | string
    createdAt?: DateTimeFilter<"PasswordReset"> | Date | string
  }

  export type PasswordResetOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PasswordResetWhereInput | PasswordResetWhereInput[]
    OR?: PasswordResetWhereInput[]
    NOT?: PasswordResetWhereInput | PasswordResetWhereInput[]
    identifier?: StringFilter<"PasswordReset"> | string
    token?: StringNullableFilter<"PasswordReset"> | string | null
    code?: StringNullableFilter<"PasswordReset"> | string | null
    expiresAt?: DateTimeFilter<"PasswordReset"> | Date | string
    createdAt?: DateTimeFilter<"PasswordReset"> | Date | string
  }, "id">

  export type PasswordResetOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetCountOrderByAggregateInput
    _avg?: PasswordResetAvgOrderByAggregateInput
    _max?: PasswordResetMaxOrderByAggregateInput
    _min?: PasswordResetMinOrderByAggregateInput
    _sum?: PasswordResetSumOrderByAggregateInput
  }

  export type PasswordResetScalarWhereWithAggregatesInput = {
    AND?: PasswordResetScalarWhereWithAggregatesInput | PasswordResetScalarWhereWithAggregatesInput[]
    OR?: PasswordResetScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetScalarWhereWithAggregatesInput | PasswordResetScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PasswordReset"> | number
    identifier?: StringWithAggregatesFilter<"PasswordReset"> | string
    token?: StringNullableWithAggregatesFilter<"PasswordReset"> | string | null
    code?: StringNullableWithAggregatesFilter<"PasswordReset"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordReset"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PasswordReset"> | Date | string
  }

  export type InscriptionGalaWhereInput = {
    AND?: InscriptionGalaWhereInput | InscriptionGalaWhereInput[]
    OR?: InscriptionGalaWhereInput[]
    NOT?: InscriptionGalaWhereInput | InscriptionGalaWhereInput[]
    id?: IntFilter<"InscriptionGala"> | number
    userId?: IntFilter<"InscriptionGala"> | number
    categorie?: EnumCategorieInscriptionFilter<"InscriptionGala"> | $Enums.CategorieInscription
    nombreInvites?: IntFilter<"InscriptionGala"> | number
    montantTotal?: IntFilter<"InscriptionGala"> | number
    statutPaiement?: EnumStatutPaiementFilter<"InscriptionGala"> | $Enums.StatutPaiement
    referencePaiement?: StringNullableFilter<"InscriptionGala"> | string | null
    ticketCode?: StringNullableFilter<"InscriptionGala"> | string | null
    qrToken?: StringNullableFilter<"InscriptionGala"> | string | null
    checkedInAt?: DateTimeNullableFilter<"InscriptionGala"> | Date | string | null
    checkedInById?: IntNullableFilter<"InscriptionGala"> | number | null
    createdAt?: DateTimeFilter<"InscriptionGala"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    checkedInBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type InscriptionGalaOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    categorie?: SortOrder
    nombreInvites?: SortOrder
    montantTotal?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrderInput | SortOrder
    ticketCode?: SortOrderInput | SortOrder
    qrToken?: SortOrderInput | SortOrder
    checkedInAt?: SortOrderInput | SortOrder
    checkedInById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    checkedInBy?: UserOrderByWithRelationInput
  }

  export type InscriptionGalaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId?: number
    ticketCode?: string
    qrToken?: string
    AND?: InscriptionGalaWhereInput | InscriptionGalaWhereInput[]
    OR?: InscriptionGalaWhereInput[]
    NOT?: InscriptionGalaWhereInput | InscriptionGalaWhereInput[]
    categorie?: EnumCategorieInscriptionFilter<"InscriptionGala"> | $Enums.CategorieInscription
    nombreInvites?: IntFilter<"InscriptionGala"> | number
    montantTotal?: IntFilter<"InscriptionGala"> | number
    statutPaiement?: EnumStatutPaiementFilter<"InscriptionGala"> | $Enums.StatutPaiement
    referencePaiement?: StringNullableFilter<"InscriptionGala"> | string | null
    checkedInAt?: DateTimeNullableFilter<"InscriptionGala"> | Date | string | null
    checkedInById?: IntNullableFilter<"InscriptionGala"> | number | null
    createdAt?: DateTimeFilter<"InscriptionGala"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    checkedInBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id" | "ticketCode" | "qrToken" | "userId">

  export type InscriptionGalaOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    categorie?: SortOrder
    nombreInvites?: SortOrder
    montantTotal?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrderInput | SortOrder
    ticketCode?: SortOrderInput | SortOrder
    qrToken?: SortOrderInput | SortOrder
    checkedInAt?: SortOrderInput | SortOrder
    checkedInById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InscriptionGalaCountOrderByAggregateInput
    _avg?: InscriptionGalaAvgOrderByAggregateInput
    _max?: InscriptionGalaMaxOrderByAggregateInput
    _min?: InscriptionGalaMinOrderByAggregateInput
    _sum?: InscriptionGalaSumOrderByAggregateInput
  }

  export type InscriptionGalaScalarWhereWithAggregatesInput = {
    AND?: InscriptionGalaScalarWhereWithAggregatesInput | InscriptionGalaScalarWhereWithAggregatesInput[]
    OR?: InscriptionGalaScalarWhereWithAggregatesInput[]
    NOT?: InscriptionGalaScalarWhereWithAggregatesInput | InscriptionGalaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"InscriptionGala"> | number
    userId?: IntWithAggregatesFilter<"InscriptionGala"> | number
    categorie?: EnumCategorieInscriptionWithAggregatesFilter<"InscriptionGala"> | $Enums.CategorieInscription
    nombreInvites?: IntWithAggregatesFilter<"InscriptionGala"> | number
    montantTotal?: IntWithAggregatesFilter<"InscriptionGala"> | number
    statutPaiement?: EnumStatutPaiementWithAggregatesFilter<"InscriptionGala"> | $Enums.StatutPaiement
    referencePaiement?: StringNullableWithAggregatesFilter<"InscriptionGala"> | string | null
    ticketCode?: StringNullableWithAggregatesFilter<"InscriptionGala"> | string | null
    qrToken?: StringNullableWithAggregatesFilter<"InscriptionGala"> | string | null
    checkedInAt?: DateTimeNullableWithAggregatesFilter<"InscriptionGala"> | Date | string | null
    checkedInById?: IntNullableWithAggregatesFilter<"InscriptionGala"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"InscriptionGala"> | Date | string
  }

  export type BilletTombolaWhereInput = {
    AND?: BilletTombolaWhereInput | BilletTombolaWhereInput[]
    OR?: BilletTombolaWhereInput[]
    NOT?: BilletTombolaWhereInput | BilletTombolaWhereInput[]
    id?: IntFilter<"BilletTombola"> | number
    userId?: IntFilter<"BilletTombola"> | number
    numeroBillet?: StringFilter<"BilletTombola"> | string
    quantite?: IntFilter<"BilletTombola"> | number
    montant?: IntFilter<"BilletTombola"> | number
    statutPaiement?: EnumStatutPaiementFilter<"BilletTombola"> | $Enums.StatutPaiement
    referencePaiement?: StringNullableFilter<"BilletTombola"> | string | null
    createdAt?: DateTimeFilter<"BilletTombola"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type BilletTombolaOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    numeroBillet?: SortOrder
    quantite?: SortOrder
    montant?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type BilletTombolaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    numeroBillet?: string
    AND?: BilletTombolaWhereInput | BilletTombolaWhereInput[]
    OR?: BilletTombolaWhereInput[]
    NOT?: BilletTombolaWhereInput | BilletTombolaWhereInput[]
    userId?: IntFilter<"BilletTombola"> | number
    quantite?: IntFilter<"BilletTombola"> | number
    montant?: IntFilter<"BilletTombola"> | number
    statutPaiement?: EnumStatutPaiementFilter<"BilletTombola"> | $Enums.StatutPaiement
    referencePaiement?: StringNullableFilter<"BilletTombola"> | string | null
    createdAt?: DateTimeFilter<"BilletTombola"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "numeroBillet">

  export type BilletTombolaOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    numeroBillet?: SortOrder
    quantite?: SortOrder
    montant?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: BilletTombolaCountOrderByAggregateInput
    _avg?: BilletTombolaAvgOrderByAggregateInput
    _max?: BilletTombolaMaxOrderByAggregateInput
    _min?: BilletTombolaMinOrderByAggregateInput
    _sum?: BilletTombolaSumOrderByAggregateInput
  }

  export type BilletTombolaScalarWhereWithAggregatesInput = {
    AND?: BilletTombolaScalarWhereWithAggregatesInput | BilletTombolaScalarWhereWithAggregatesInput[]
    OR?: BilletTombolaScalarWhereWithAggregatesInput[]
    NOT?: BilletTombolaScalarWhereWithAggregatesInput | BilletTombolaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BilletTombola"> | number
    userId?: IntWithAggregatesFilter<"BilletTombola"> | number
    numeroBillet?: StringWithAggregatesFilter<"BilletTombola"> | string
    quantite?: IntWithAggregatesFilter<"BilletTombola"> | number
    montant?: IntWithAggregatesFilter<"BilletTombola"> | number
    statutPaiement?: EnumStatutPaiementWithAggregatesFilter<"BilletTombola"> | $Enums.StatutPaiement
    referencePaiement?: StringNullableWithAggregatesFilter<"BilletTombola"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BilletTombola"> | Date | string
  }

  export type ContactMessageWhereInput = {
    AND?: ContactMessageWhereInput | ContactMessageWhereInput[]
    OR?: ContactMessageWhereInput[]
    NOT?: ContactMessageWhereInput | ContactMessageWhereInput[]
    id?: IntFilter<"ContactMessage"> | number
    nom?: StringFilter<"ContactMessage"> | string
    email?: StringFilter<"ContactMessage"> | string
    sujet?: StringFilter<"ContactMessage"> | string
    message?: StringFilter<"ContactMessage"> | string
    lu?: BoolFilter<"ContactMessage"> | boolean
    createdAt?: DateTimeFilter<"ContactMessage"> | Date | string
  }

  export type ContactMessageOrderByWithRelationInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    sujet?: SortOrder
    message?: SortOrder
    lu?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ContactMessageWhereInput | ContactMessageWhereInput[]
    OR?: ContactMessageWhereInput[]
    NOT?: ContactMessageWhereInput | ContactMessageWhereInput[]
    nom?: StringFilter<"ContactMessage"> | string
    email?: StringFilter<"ContactMessage"> | string
    sujet?: StringFilter<"ContactMessage"> | string
    message?: StringFilter<"ContactMessage"> | string
    lu?: BoolFilter<"ContactMessage"> | boolean
    createdAt?: DateTimeFilter<"ContactMessage"> | Date | string
  }, "id">

  export type ContactMessageOrderByWithAggregationInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    sujet?: SortOrder
    message?: SortOrder
    lu?: SortOrder
    createdAt?: SortOrder
    _count?: ContactMessageCountOrderByAggregateInput
    _avg?: ContactMessageAvgOrderByAggregateInput
    _max?: ContactMessageMaxOrderByAggregateInput
    _min?: ContactMessageMinOrderByAggregateInput
    _sum?: ContactMessageSumOrderByAggregateInput
  }

  export type ContactMessageScalarWhereWithAggregatesInput = {
    AND?: ContactMessageScalarWhereWithAggregatesInput | ContactMessageScalarWhereWithAggregatesInput[]
    OR?: ContactMessageScalarWhereWithAggregatesInput[]
    NOT?: ContactMessageScalarWhereWithAggregatesInput | ContactMessageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ContactMessage"> | number
    nom?: StringWithAggregatesFilter<"ContactMessage"> | string
    email?: StringWithAggregatesFilter<"ContactMessage"> | string
    sujet?: StringWithAggregatesFilter<"ContactMessage"> | string
    message?: StringWithAggregatesFilter<"ContactMessage"> | string
    lu?: BoolWithAggregatesFilter<"ContactMessage"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ContactMessage"> | Date | string
  }

  export type UserCreateInput = {
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inscriptionsGala?: InscriptionGalaCreateNestedManyWithoutUserInput
    scannedInscriptions?: InscriptionGalaCreateNestedManyWithoutCheckedInByInput
    billetsTombola?: BilletTombolaCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inscriptionsGala?: InscriptionGalaUncheckedCreateNestedManyWithoutUserInput
    scannedInscriptions?: InscriptionGalaUncheckedCreateNestedManyWithoutCheckedInByInput
    billetsTombola?: BilletTombolaUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inscriptionsGala?: InscriptionGalaUpdateManyWithoutUserNestedInput
    scannedInscriptions?: InscriptionGalaUpdateManyWithoutCheckedInByNestedInput
    billetsTombola?: BilletTombolaUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inscriptionsGala?: InscriptionGalaUncheckedUpdateManyWithoutUserNestedInput
    scannedInscriptions?: InscriptionGalaUncheckedUpdateManyWithoutCheckedInByNestedInput
    billetsTombola?: BilletTombolaUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventSettingCreateInput = {
    key: string
    title: string
    subtitle?: string | null
    description?: string | null
    location?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventSettingUncheckedCreateInput = {
    id?: number
    key: string
    title: string
    subtitle?: string | null
    description?: string | null
    location?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventSettingUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventSettingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventSettingCreateManyInput = {
    id?: number
    key: string
    title: string
    subtitle?: string | null
    description?: string | null
    location?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventSettingUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventSettingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCreateInput = {
    identifier: string
    token?: string | null
    code?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetUncheckedCreateInput = {
    id?: number
    identifier: string
    token?: string | null
    code?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    identifier?: StringFieldUpdateOperationsInput | string
    token?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCreateManyInput = {
    id?: number
    identifier: string
    token?: string | null
    code?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    identifier?: StringFieldUpdateOperationsInput | string
    token?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InscriptionGalaCreateInput = {
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutInscriptionsGalaInput
    checkedInBy?: UserCreateNestedOneWithoutScannedInscriptionsInput
  }

  export type InscriptionGalaUncheckedCreateInput = {
    id?: number
    userId: number
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    checkedInById?: number | null
    createdAt?: Date | string
  }

  export type InscriptionGalaUpdateInput = {
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInscriptionsGalaNestedInput
    checkedInBy?: UserUpdateOneWithoutScannedInscriptionsNestedInput
  }

  export type InscriptionGalaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InscriptionGalaCreateManyInput = {
    id?: number
    userId: number
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    checkedInById?: number | null
    createdAt?: Date | string
  }

  export type InscriptionGalaUpdateManyMutationInput = {
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InscriptionGalaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilletTombolaCreateInput = {
    numeroBillet: string
    quantite?: number
    montant: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutBilletsTombolaInput
  }

  export type BilletTombolaUncheckedCreateInput = {
    id?: number
    userId: number
    numeroBillet: string
    quantite?: number
    montant: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    createdAt?: Date | string
  }

  export type BilletTombolaUpdateInput = {
    numeroBillet?: StringFieldUpdateOperationsInput | string
    quantite?: IntFieldUpdateOperationsInput | number
    montant?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBilletsTombolaNestedInput
  }

  export type BilletTombolaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    numeroBillet?: StringFieldUpdateOperationsInput | string
    quantite?: IntFieldUpdateOperationsInput | number
    montant?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilletTombolaCreateManyInput = {
    id?: number
    userId: number
    numeroBillet: string
    quantite?: number
    montant: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    createdAt?: Date | string
  }

  export type BilletTombolaUpdateManyMutationInput = {
    numeroBillet?: StringFieldUpdateOperationsInput | string
    quantite?: IntFieldUpdateOperationsInput | number
    montant?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilletTombolaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    numeroBillet?: StringFieldUpdateOperationsInput | string
    quantite?: IntFieldUpdateOperationsInput | number
    montant?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageCreateInput = {
    nom: string
    email: string
    sujet: string
    message: string
    lu?: boolean
    createdAt?: Date | string
  }

  export type ContactMessageUncheckedCreateInput = {
    id?: number
    nom: string
    email: string
    sujet: string
    message: string
    lu?: boolean
    createdAt?: Date | string
  }

  export type ContactMessageUpdateInput = {
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    sujet?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    lu?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    sujet?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    lu?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageCreateManyInput = {
    id?: number
    nom: string
    email: string
    sujet: string
    message: string
    lu?: boolean
    createdAt?: Date | string
  }

  export type ContactMessageUpdateManyMutationInput = {
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    sujet?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    lu?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    sujet?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    lu?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type InscriptionGalaListRelationFilter = {
    every?: InscriptionGalaWhereInput
    some?: InscriptionGalaWhereInput
    none?: InscriptionGalaWhereInput
  }

  export type BilletTombolaListRelationFilter = {
    every?: BilletTombolaWhereInput
    some?: BilletTombolaWhereInput
    none?: BilletTombolaWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type InscriptionGalaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BilletTombolaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    telephone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    telephone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    telephone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EventSettingCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    description?: SortOrder
    location?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSettingAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EventSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    description?: SortOrder
    location?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSettingMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    description?: SortOrder
    location?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSettingSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PasswordResetCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PasswordResetMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumCategorieInscriptionFilter<$PrismaModel = never> = {
    equals?: $Enums.CategorieInscription | EnumCategorieInscriptionFieldRefInput<$PrismaModel>
    in?: $Enums.CategorieInscription[]
    notIn?: $Enums.CategorieInscription[]
    not?: NestedEnumCategorieInscriptionFilter<$PrismaModel> | $Enums.CategorieInscription
  }

  export type EnumStatutPaiementFilter<$PrismaModel = never> = {
    equals?: $Enums.StatutPaiement | EnumStatutPaiementFieldRefInput<$PrismaModel>
    in?: $Enums.StatutPaiement[]
    notIn?: $Enums.StatutPaiement[]
    not?: NestedEnumStatutPaiementFilter<$PrismaModel> | $Enums.StatutPaiement
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type InscriptionGalaCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    categorie?: SortOrder
    nombreInvites?: SortOrder
    montantTotal?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrder
    ticketCode?: SortOrder
    qrToken?: SortOrder
    checkedInAt?: SortOrder
    checkedInById?: SortOrder
    createdAt?: SortOrder
  }

  export type InscriptionGalaAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nombreInvites?: SortOrder
    montantTotal?: SortOrder
    checkedInById?: SortOrder
  }

  export type InscriptionGalaMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    categorie?: SortOrder
    nombreInvites?: SortOrder
    montantTotal?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrder
    ticketCode?: SortOrder
    qrToken?: SortOrder
    checkedInAt?: SortOrder
    checkedInById?: SortOrder
    createdAt?: SortOrder
  }

  export type InscriptionGalaMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    categorie?: SortOrder
    nombreInvites?: SortOrder
    montantTotal?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrder
    ticketCode?: SortOrder
    qrToken?: SortOrder
    checkedInAt?: SortOrder
    checkedInById?: SortOrder
    createdAt?: SortOrder
  }

  export type InscriptionGalaSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nombreInvites?: SortOrder
    montantTotal?: SortOrder
    checkedInById?: SortOrder
  }

  export type EnumCategorieInscriptionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CategorieInscription | EnumCategorieInscriptionFieldRefInput<$PrismaModel>
    in?: $Enums.CategorieInscription[]
    notIn?: $Enums.CategorieInscription[]
    not?: NestedEnumCategorieInscriptionWithAggregatesFilter<$PrismaModel> | $Enums.CategorieInscription
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCategorieInscriptionFilter<$PrismaModel>
    _max?: NestedEnumCategorieInscriptionFilter<$PrismaModel>
  }

  export type EnumStatutPaiementWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatutPaiement | EnumStatutPaiementFieldRefInput<$PrismaModel>
    in?: $Enums.StatutPaiement[]
    notIn?: $Enums.StatutPaiement[]
    not?: NestedEnumStatutPaiementWithAggregatesFilter<$PrismaModel> | $Enums.StatutPaiement
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatutPaiementFilter<$PrismaModel>
    _max?: NestedEnumStatutPaiementFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BilletTombolaCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    numeroBillet?: SortOrder
    quantite?: SortOrder
    montant?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrder
    createdAt?: SortOrder
  }

  export type BilletTombolaAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    quantite?: SortOrder
    montant?: SortOrder
  }

  export type BilletTombolaMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    numeroBillet?: SortOrder
    quantite?: SortOrder
    montant?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrder
    createdAt?: SortOrder
  }

  export type BilletTombolaMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    numeroBillet?: SortOrder
    quantite?: SortOrder
    montant?: SortOrder
    statutPaiement?: SortOrder
    referencePaiement?: SortOrder
    createdAt?: SortOrder
  }

  export type BilletTombolaSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    quantite?: SortOrder
    montant?: SortOrder
  }

  export type ContactMessageCountOrderByAggregateInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    sujet?: SortOrder
    message?: SortOrder
    lu?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ContactMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    sujet?: SortOrder
    message?: SortOrder
    lu?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageMinOrderByAggregateInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    sujet?: SortOrder
    message?: SortOrder
    lu?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type InscriptionGalaCreateNestedManyWithoutUserInput = {
    create?: XOR<InscriptionGalaCreateWithoutUserInput, InscriptionGalaUncheckedCreateWithoutUserInput> | InscriptionGalaCreateWithoutUserInput[] | InscriptionGalaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InscriptionGalaCreateOrConnectWithoutUserInput | InscriptionGalaCreateOrConnectWithoutUserInput[]
    createMany?: InscriptionGalaCreateManyUserInputEnvelope
    connect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
  }

  export type InscriptionGalaCreateNestedManyWithoutCheckedInByInput = {
    create?: XOR<InscriptionGalaCreateWithoutCheckedInByInput, InscriptionGalaUncheckedCreateWithoutCheckedInByInput> | InscriptionGalaCreateWithoutCheckedInByInput[] | InscriptionGalaUncheckedCreateWithoutCheckedInByInput[]
    connectOrCreate?: InscriptionGalaCreateOrConnectWithoutCheckedInByInput | InscriptionGalaCreateOrConnectWithoutCheckedInByInput[]
    createMany?: InscriptionGalaCreateManyCheckedInByInputEnvelope
    connect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
  }

  export type BilletTombolaCreateNestedManyWithoutUserInput = {
    create?: XOR<BilletTombolaCreateWithoutUserInput, BilletTombolaUncheckedCreateWithoutUserInput> | BilletTombolaCreateWithoutUserInput[] | BilletTombolaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BilletTombolaCreateOrConnectWithoutUserInput | BilletTombolaCreateOrConnectWithoutUserInput[]
    createMany?: BilletTombolaCreateManyUserInputEnvelope
    connect?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
  }

  export type InscriptionGalaUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<InscriptionGalaCreateWithoutUserInput, InscriptionGalaUncheckedCreateWithoutUserInput> | InscriptionGalaCreateWithoutUserInput[] | InscriptionGalaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InscriptionGalaCreateOrConnectWithoutUserInput | InscriptionGalaCreateOrConnectWithoutUserInput[]
    createMany?: InscriptionGalaCreateManyUserInputEnvelope
    connect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
  }

  export type InscriptionGalaUncheckedCreateNestedManyWithoutCheckedInByInput = {
    create?: XOR<InscriptionGalaCreateWithoutCheckedInByInput, InscriptionGalaUncheckedCreateWithoutCheckedInByInput> | InscriptionGalaCreateWithoutCheckedInByInput[] | InscriptionGalaUncheckedCreateWithoutCheckedInByInput[]
    connectOrCreate?: InscriptionGalaCreateOrConnectWithoutCheckedInByInput | InscriptionGalaCreateOrConnectWithoutCheckedInByInput[]
    createMany?: InscriptionGalaCreateManyCheckedInByInputEnvelope
    connect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
  }

  export type BilletTombolaUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BilletTombolaCreateWithoutUserInput, BilletTombolaUncheckedCreateWithoutUserInput> | BilletTombolaCreateWithoutUserInput[] | BilletTombolaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BilletTombolaCreateOrConnectWithoutUserInput | BilletTombolaCreateOrConnectWithoutUserInput[]
    createMany?: BilletTombolaCreateManyUserInputEnvelope
    connect?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type InscriptionGalaUpdateManyWithoutUserNestedInput = {
    create?: XOR<InscriptionGalaCreateWithoutUserInput, InscriptionGalaUncheckedCreateWithoutUserInput> | InscriptionGalaCreateWithoutUserInput[] | InscriptionGalaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InscriptionGalaCreateOrConnectWithoutUserInput | InscriptionGalaCreateOrConnectWithoutUserInput[]
    upsert?: InscriptionGalaUpsertWithWhereUniqueWithoutUserInput | InscriptionGalaUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InscriptionGalaCreateManyUserInputEnvelope
    set?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    disconnect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    delete?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    connect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    update?: InscriptionGalaUpdateWithWhereUniqueWithoutUserInput | InscriptionGalaUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InscriptionGalaUpdateManyWithWhereWithoutUserInput | InscriptionGalaUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InscriptionGalaScalarWhereInput | InscriptionGalaScalarWhereInput[]
  }

  export type InscriptionGalaUpdateManyWithoutCheckedInByNestedInput = {
    create?: XOR<InscriptionGalaCreateWithoutCheckedInByInput, InscriptionGalaUncheckedCreateWithoutCheckedInByInput> | InscriptionGalaCreateWithoutCheckedInByInput[] | InscriptionGalaUncheckedCreateWithoutCheckedInByInput[]
    connectOrCreate?: InscriptionGalaCreateOrConnectWithoutCheckedInByInput | InscriptionGalaCreateOrConnectWithoutCheckedInByInput[]
    upsert?: InscriptionGalaUpsertWithWhereUniqueWithoutCheckedInByInput | InscriptionGalaUpsertWithWhereUniqueWithoutCheckedInByInput[]
    createMany?: InscriptionGalaCreateManyCheckedInByInputEnvelope
    set?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    disconnect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    delete?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    connect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    update?: InscriptionGalaUpdateWithWhereUniqueWithoutCheckedInByInput | InscriptionGalaUpdateWithWhereUniqueWithoutCheckedInByInput[]
    updateMany?: InscriptionGalaUpdateManyWithWhereWithoutCheckedInByInput | InscriptionGalaUpdateManyWithWhereWithoutCheckedInByInput[]
    deleteMany?: InscriptionGalaScalarWhereInput | InscriptionGalaScalarWhereInput[]
  }

  export type BilletTombolaUpdateManyWithoutUserNestedInput = {
    create?: XOR<BilletTombolaCreateWithoutUserInput, BilletTombolaUncheckedCreateWithoutUserInput> | BilletTombolaCreateWithoutUserInput[] | BilletTombolaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BilletTombolaCreateOrConnectWithoutUserInput | BilletTombolaCreateOrConnectWithoutUserInput[]
    upsert?: BilletTombolaUpsertWithWhereUniqueWithoutUserInput | BilletTombolaUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BilletTombolaCreateManyUserInputEnvelope
    set?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
    disconnect?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
    delete?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
    connect?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
    update?: BilletTombolaUpdateWithWhereUniqueWithoutUserInput | BilletTombolaUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BilletTombolaUpdateManyWithWhereWithoutUserInput | BilletTombolaUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BilletTombolaScalarWhereInput | BilletTombolaScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InscriptionGalaUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<InscriptionGalaCreateWithoutUserInput, InscriptionGalaUncheckedCreateWithoutUserInput> | InscriptionGalaCreateWithoutUserInput[] | InscriptionGalaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InscriptionGalaCreateOrConnectWithoutUserInput | InscriptionGalaCreateOrConnectWithoutUserInput[]
    upsert?: InscriptionGalaUpsertWithWhereUniqueWithoutUserInput | InscriptionGalaUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InscriptionGalaCreateManyUserInputEnvelope
    set?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    disconnect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    delete?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    connect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    update?: InscriptionGalaUpdateWithWhereUniqueWithoutUserInput | InscriptionGalaUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InscriptionGalaUpdateManyWithWhereWithoutUserInput | InscriptionGalaUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InscriptionGalaScalarWhereInput | InscriptionGalaScalarWhereInput[]
  }

  export type InscriptionGalaUncheckedUpdateManyWithoutCheckedInByNestedInput = {
    create?: XOR<InscriptionGalaCreateWithoutCheckedInByInput, InscriptionGalaUncheckedCreateWithoutCheckedInByInput> | InscriptionGalaCreateWithoutCheckedInByInput[] | InscriptionGalaUncheckedCreateWithoutCheckedInByInput[]
    connectOrCreate?: InscriptionGalaCreateOrConnectWithoutCheckedInByInput | InscriptionGalaCreateOrConnectWithoutCheckedInByInput[]
    upsert?: InscriptionGalaUpsertWithWhereUniqueWithoutCheckedInByInput | InscriptionGalaUpsertWithWhereUniqueWithoutCheckedInByInput[]
    createMany?: InscriptionGalaCreateManyCheckedInByInputEnvelope
    set?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    disconnect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    delete?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    connect?: InscriptionGalaWhereUniqueInput | InscriptionGalaWhereUniqueInput[]
    update?: InscriptionGalaUpdateWithWhereUniqueWithoutCheckedInByInput | InscriptionGalaUpdateWithWhereUniqueWithoutCheckedInByInput[]
    updateMany?: InscriptionGalaUpdateManyWithWhereWithoutCheckedInByInput | InscriptionGalaUpdateManyWithWhereWithoutCheckedInByInput[]
    deleteMany?: InscriptionGalaScalarWhereInput | InscriptionGalaScalarWhereInput[]
  }

  export type BilletTombolaUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BilletTombolaCreateWithoutUserInput, BilletTombolaUncheckedCreateWithoutUserInput> | BilletTombolaCreateWithoutUserInput[] | BilletTombolaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BilletTombolaCreateOrConnectWithoutUserInput | BilletTombolaCreateOrConnectWithoutUserInput[]
    upsert?: BilletTombolaUpsertWithWhereUniqueWithoutUserInput | BilletTombolaUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BilletTombolaCreateManyUserInputEnvelope
    set?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
    disconnect?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
    delete?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
    connect?: BilletTombolaWhereUniqueInput | BilletTombolaWhereUniqueInput[]
    update?: BilletTombolaUpdateWithWhereUniqueWithoutUserInput | BilletTombolaUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BilletTombolaUpdateManyWithWhereWithoutUserInput | BilletTombolaUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BilletTombolaScalarWhereInput | BilletTombolaScalarWhereInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserCreateNestedOneWithoutInscriptionsGalaInput = {
    create?: XOR<UserCreateWithoutInscriptionsGalaInput, UserUncheckedCreateWithoutInscriptionsGalaInput>
    connectOrCreate?: UserCreateOrConnectWithoutInscriptionsGalaInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutScannedInscriptionsInput = {
    create?: XOR<UserCreateWithoutScannedInscriptionsInput, UserUncheckedCreateWithoutScannedInscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutScannedInscriptionsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumCategorieInscriptionFieldUpdateOperationsInput = {
    set?: $Enums.CategorieInscription
  }

  export type EnumStatutPaiementFieldUpdateOperationsInput = {
    set?: $Enums.StatutPaiement
  }

  export type UserUpdateOneRequiredWithoutInscriptionsGalaNestedInput = {
    create?: XOR<UserCreateWithoutInscriptionsGalaInput, UserUncheckedCreateWithoutInscriptionsGalaInput>
    connectOrCreate?: UserCreateOrConnectWithoutInscriptionsGalaInput
    upsert?: UserUpsertWithoutInscriptionsGalaInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInscriptionsGalaInput, UserUpdateWithoutInscriptionsGalaInput>, UserUncheckedUpdateWithoutInscriptionsGalaInput>
  }

  export type UserUpdateOneWithoutScannedInscriptionsNestedInput = {
    create?: XOR<UserCreateWithoutScannedInscriptionsInput, UserUncheckedCreateWithoutScannedInscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutScannedInscriptionsInput
    upsert?: UserUpsertWithoutScannedInscriptionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutScannedInscriptionsInput, UserUpdateWithoutScannedInscriptionsInput>, UserUncheckedUpdateWithoutScannedInscriptionsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserCreateNestedOneWithoutBilletsTombolaInput = {
    create?: XOR<UserCreateWithoutBilletsTombolaInput, UserUncheckedCreateWithoutBilletsTombolaInput>
    connectOrCreate?: UserCreateOrConnectWithoutBilletsTombolaInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBilletsTombolaNestedInput = {
    create?: XOR<UserCreateWithoutBilletsTombolaInput, UserUncheckedCreateWithoutBilletsTombolaInput>
    connectOrCreate?: UserCreateOrConnectWithoutBilletsTombolaInput
    upsert?: UserUpsertWithoutBilletsTombolaInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBilletsTombolaInput, UserUpdateWithoutBilletsTombolaInput>, UserUncheckedUpdateWithoutBilletsTombolaInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumCategorieInscriptionFilter<$PrismaModel = never> = {
    equals?: $Enums.CategorieInscription | EnumCategorieInscriptionFieldRefInput<$PrismaModel>
    in?: $Enums.CategorieInscription[]
    notIn?: $Enums.CategorieInscription[]
    not?: NestedEnumCategorieInscriptionFilter<$PrismaModel> | $Enums.CategorieInscription
  }

  export type NestedEnumStatutPaiementFilter<$PrismaModel = never> = {
    equals?: $Enums.StatutPaiement | EnumStatutPaiementFieldRefInput<$PrismaModel>
    in?: $Enums.StatutPaiement[]
    notIn?: $Enums.StatutPaiement[]
    not?: NestedEnumStatutPaiementFilter<$PrismaModel> | $Enums.StatutPaiement
  }

  export type NestedEnumCategorieInscriptionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CategorieInscription | EnumCategorieInscriptionFieldRefInput<$PrismaModel>
    in?: $Enums.CategorieInscription[]
    notIn?: $Enums.CategorieInscription[]
    not?: NestedEnumCategorieInscriptionWithAggregatesFilter<$PrismaModel> | $Enums.CategorieInscription
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCategorieInscriptionFilter<$PrismaModel>
    _max?: NestedEnumCategorieInscriptionFilter<$PrismaModel>
  }

  export type NestedEnumStatutPaiementWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatutPaiement | EnumStatutPaiementFieldRefInput<$PrismaModel>
    in?: $Enums.StatutPaiement[]
    notIn?: $Enums.StatutPaiement[]
    not?: NestedEnumStatutPaiementWithAggregatesFilter<$PrismaModel> | $Enums.StatutPaiement
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatutPaiementFilter<$PrismaModel>
    _max?: NestedEnumStatutPaiementFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type InscriptionGalaCreateWithoutUserInput = {
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    createdAt?: Date | string
    checkedInBy?: UserCreateNestedOneWithoutScannedInscriptionsInput
  }

  export type InscriptionGalaUncheckedCreateWithoutUserInput = {
    id?: number
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    checkedInById?: number | null
    createdAt?: Date | string
  }

  export type InscriptionGalaCreateOrConnectWithoutUserInput = {
    where: InscriptionGalaWhereUniqueInput
    create: XOR<InscriptionGalaCreateWithoutUserInput, InscriptionGalaUncheckedCreateWithoutUserInput>
  }

  export type InscriptionGalaCreateManyUserInputEnvelope = {
    data: InscriptionGalaCreateManyUserInput | InscriptionGalaCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type InscriptionGalaCreateWithoutCheckedInByInput = {
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutInscriptionsGalaInput
  }

  export type InscriptionGalaUncheckedCreateWithoutCheckedInByInput = {
    id?: number
    userId: number
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InscriptionGalaCreateOrConnectWithoutCheckedInByInput = {
    where: InscriptionGalaWhereUniqueInput
    create: XOR<InscriptionGalaCreateWithoutCheckedInByInput, InscriptionGalaUncheckedCreateWithoutCheckedInByInput>
  }

  export type InscriptionGalaCreateManyCheckedInByInputEnvelope = {
    data: InscriptionGalaCreateManyCheckedInByInput | InscriptionGalaCreateManyCheckedInByInput[]
    skipDuplicates?: boolean
  }

  export type BilletTombolaCreateWithoutUserInput = {
    numeroBillet: string
    quantite?: number
    montant: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    createdAt?: Date | string
  }

  export type BilletTombolaUncheckedCreateWithoutUserInput = {
    id?: number
    numeroBillet: string
    quantite?: number
    montant: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    createdAt?: Date | string
  }

  export type BilletTombolaCreateOrConnectWithoutUserInput = {
    where: BilletTombolaWhereUniqueInput
    create: XOR<BilletTombolaCreateWithoutUserInput, BilletTombolaUncheckedCreateWithoutUserInput>
  }

  export type BilletTombolaCreateManyUserInputEnvelope = {
    data: BilletTombolaCreateManyUserInput | BilletTombolaCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type InscriptionGalaUpsertWithWhereUniqueWithoutUserInput = {
    where: InscriptionGalaWhereUniqueInput
    update: XOR<InscriptionGalaUpdateWithoutUserInput, InscriptionGalaUncheckedUpdateWithoutUserInput>
    create: XOR<InscriptionGalaCreateWithoutUserInput, InscriptionGalaUncheckedCreateWithoutUserInput>
  }

  export type InscriptionGalaUpdateWithWhereUniqueWithoutUserInput = {
    where: InscriptionGalaWhereUniqueInput
    data: XOR<InscriptionGalaUpdateWithoutUserInput, InscriptionGalaUncheckedUpdateWithoutUserInput>
  }

  export type InscriptionGalaUpdateManyWithWhereWithoutUserInput = {
    where: InscriptionGalaScalarWhereInput
    data: XOR<InscriptionGalaUpdateManyMutationInput, InscriptionGalaUncheckedUpdateManyWithoutUserInput>
  }

  export type InscriptionGalaScalarWhereInput = {
    AND?: InscriptionGalaScalarWhereInput | InscriptionGalaScalarWhereInput[]
    OR?: InscriptionGalaScalarWhereInput[]
    NOT?: InscriptionGalaScalarWhereInput | InscriptionGalaScalarWhereInput[]
    id?: IntFilter<"InscriptionGala"> | number
    userId?: IntFilter<"InscriptionGala"> | number
    categorie?: EnumCategorieInscriptionFilter<"InscriptionGala"> | $Enums.CategorieInscription
    nombreInvites?: IntFilter<"InscriptionGala"> | number
    montantTotal?: IntFilter<"InscriptionGala"> | number
    statutPaiement?: EnumStatutPaiementFilter<"InscriptionGala"> | $Enums.StatutPaiement
    referencePaiement?: StringNullableFilter<"InscriptionGala"> | string | null
    ticketCode?: StringNullableFilter<"InscriptionGala"> | string | null
    qrToken?: StringNullableFilter<"InscriptionGala"> | string | null
    checkedInAt?: DateTimeNullableFilter<"InscriptionGala"> | Date | string | null
    checkedInById?: IntNullableFilter<"InscriptionGala"> | number | null
    createdAt?: DateTimeFilter<"InscriptionGala"> | Date | string
  }

  export type InscriptionGalaUpsertWithWhereUniqueWithoutCheckedInByInput = {
    where: InscriptionGalaWhereUniqueInput
    update: XOR<InscriptionGalaUpdateWithoutCheckedInByInput, InscriptionGalaUncheckedUpdateWithoutCheckedInByInput>
    create: XOR<InscriptionGalaCreateWithoutCheckedInByInput, InscriptionGalaUncheckedCreateWithoutCheckedInByInput>
  }

  export type InscriptionGalaUpdateWithWhereUniqueWithoutCheckedInByInput = {
    where: InscriptionGalaWhereUniqueInput
    data: XOR<InscriptionGalaUpdateWithoutCheckedInByInput, InscriptionGalaUncheckedUpdateWithoutCheckedInByInput>
  }

  export type InscriptionGalaUpdateManyWithWhereWithoutCheckedInByInput = {
    where: InscriptionGalaScalarWhereInput
    data: XOR<InscriptionGalaUpdateManyMutationInput, InscriptionGalaUncheckedUpdateManyWithoutCheckedInByInput>
  }

  export type BilletTombolaUpsertWithWhereUniqueWithoutUserInput = {
    where: BilletTombolaWhereUniqueInput
    update: XOR<BilletTombolaUpdateWithoutUserInput, BilletTombolaUncheckedUpdateWithoutUserInput>
    create: XOR<BilletTombolaCreateWithoutUserInput, BilletTombolaUncheckedCreateWithoutUserInput>
  }

  export type BilletTombolaUpdateWithWhereUniqueWithoutUserInput = {
    where: BilletTombolaWhereUniqueInput
    data: XOR<BilletTombolaUpdateWithoutUserInput, BilletTombolaUncheckedUpdateWithoutUserInput>
  }

  export type BilletTombolaUpdateManyWithWhereWithoutUserInput = {
    where: BilletTombolaScalarWhereInput
    data: XOR<BilletTombolaUpdateManyMutationInput, BilletTombolaUncheckedUpdateManyWithoutUserInput>
  }

  export type BilletTombolaScalarWhereInput = {
    AND?: BilletTombolaScalarWhereInput | BilletTombolaScalarWhereInput[]
    OR?: BilletTombolaScalarWhereInput[]
    NOT?: BilletTombolaScalarWhereInput | BilletTombolaScalarWhereInput[]
    id?: IntFilter<"BilletTombola"> | number
    userId?: IntFilter<"BilletTombola"> | number
    numeroBillet?: StringFilter<"BilletTombola"> | string
    quantite?: IntFilter<"BilletTombola"> | number
    montant?: IntFilter<"BilletTombola"> | number
    statutPaiement?: EnumStatutPaiementFilter<"BilletTombola"> | $Enums.StatutPaiement
    referencePaiement?: StringNullableFilter<"BilletTombola"> | string | null
    createdAt?: DateTimeFilter<"BilletTombola"> | Date | string
  }

  export type UserCreateWithoutInscriptionsGalaInput = {
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    scannedInscriptions?: InscriptionGalaCreateNestedManyWithoutCheckedInByInput
    billetsTombola?: BilletTombolaCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutInscriptionsGalaInput = {
    id?: number
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    scannedInscriptions?: InscriptionGalaUncheckedCreateNestedManyWithoutCheckedInByInput
    billetsTombola?: BilletTombolaUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutInscriptionsGalaInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInscriptionsGalaInput, UserUncheckedCreateWithoutInscriptionsGalaInput>
  }

  export type UserCreateWithoutScannedInscriptionsInput = {
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inscriptionsGala?: InscriptionGalaCreateNestedManyWithoutUserInput
    billetsTombola?: BilletTombolaCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutScannedInscriptionsInput = {
    id?: number
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inscriptionsGala?: InscriptionGalaUncheckedCreateNestedManyWithoutUserInput
    billetsTombola?: BilletTombolaUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutScannedInscriptionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutScannedInscriptionsInput, UserUncheckedCreateWithoutScannedInscriptionsInput>
  }

  export type UserUpsertWithoutInscriptionsGalaInput = {
    update: XOR<UserUpdateWithoutInscriptionsGalaInput, UserUncheckedUpdateWithoutInscriptionsGalaInput>
    create: XOR<UserCreateWithoutInscriptionsGalaInput, UserUncheckedCreateWithoutInscriptionsGalaInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInscriptionsGalaInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInscriptionsGalaInput, UserUncheckedUpdateWithoutInscriptionsGalaInput>
  }

  export type UserUpdateWithoutInscriptionsGalaInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scannedInscriptions?: InscriptionGalaUpdateManyWithoutCheckedInByNestedInput
    billetsTombola?: BilletTombolaUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutInscriptionsGalaInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scannedInscriptions?: InscriptionGalaUncheckedUpdateManyWithoutCheckedInByNestedInput
    billetsTombola?: BilletTombolaUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutScannedInscriptionsInput = {
    update: XOR<UserUpdateWithoutScannedInscriptionsInput, UserUncheckedUpdateWithoutScannedInscriptionsInput>
    create: XOR<UserCreateWithoutScannedInscriptionsInput, UserUncheckedCreateWithoutScannedInscriptionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutScannedInscriptionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutScannedInscriptionsInput, UserUncheckedUpdateWithoutScannedInscriptionsInput>
  }

  export type UserUpdateWithoutScannedInscriptionsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inscriptionsGala?: InscriptionGalaUpdateManyWithoutUserNestedInput
    billetsTombola?: BilletTombolaUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutScannedInscriptionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inscriptionsGala?: InscriptionGalaUncheckedUpdateManyWithoutUserNestedInput
    billetsTombola?: BilletTombolaUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutBilletsTombolaInput = {
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inscriptionsGala?: InscriptionGalaCreateNestedManyWithoutUserInput
    scannedInscriptions?: InscriptionGalaCreateNestedManyWithoutCheckedInByInput
  }

  export type UserUncheckedCreateWithoutBilletsTombolaInput = {
    id?: number
    email: string
    password: string
    role?: $Enums.Role
    nom: string
    prenom: string
    telephone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inscriptionsGala?: InscriptionGalaUncheckedCreateNestedManyWithoutUserInput
    scannedInscriptions?: InscriptionGalaUncheckedCreateNestedManyWithoutCheckedInByInput
  }

  export type UserCreateOrConnectWithoutBilletsTombolaInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBilletsTombolaInput, UserUncheckedCreateWithoutBilletsTombolaInput>
  }

  export type UserUpsertWithoutBilletsTombolaInput = {
    update: XOR<UserUpdateWithoutBilletsTombolaInput, UserUncheckedUpdateWithoutBilletsTombolaInput>
    create: XOR<UserCreateWithoutBilletsTombolaInput, UserUncheckedCreateWithoutBilletsTombolaInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBilletsTombolaInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBilletsTombolaInput, UserUncheckedUpdateWithoutBilletsTombolaInput>
  }

  export type UserUpdateWithoutBilletsTombolaInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inscriptionsGala?: InscriptionGalaUpdateManyWithoutUserNestedInput
    scannedInscriptions?: InscriptionGalaUpdateManyWithoutCheckedInByNestedInput
  }

  export type UserUncheckedUpdateWithoutBilletsTombolaInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inscriptionsGala?: InscriptionGalaUncheckedUpdateManyWithoutUserNestedInput
    scannedInscriptions?: InscriptionGalaUncheckedUpdateManyWithoutCheckedInByNestedInput
  }

  export type InscriptionGalaCreateManyUserInput = {
    id?: number
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    checkedInById?: number | null
    createdAt?: Date | string
  }

  export type InscriptionGalaCreateManyCheckedInByInput = {
    id?: number
    userId: number
    categorie: $Enums.CategorieInscription
    nombreInvites?: number
    montantTotal: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    ticketCode?: string | null
    qrToken?: string | null
    checkedInAt?: Date | string | null
    createdAt?: Date | string
  }

  export type BilletTombolaCreateManyUserInput = {
    id?: number
    numeroBillet: string
    quantite?: number
    montant: number
    statutPaiement?: $Enums.StatutPaiement
    referencePaiement?: string | null
    createdAt?: Date | string
  }

  export type InscriptionGalaUpdateWithoutUserInput = {
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedInBy?: UserUpdateOneWithoutScannedInscriptionsNestedInput
  }

  export type InscriptionGalaUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InscriptionGalaUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InscriptionGalaUpdateWithoutCheckedInByInput = {
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInscriptionsGalaNestedInput
  }

  export type InscriptionGalaUncheckedUpdateWithoutCheckedInByInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InscriptionGalaUncheckedUpdateManyWithoutCheckedInByInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    categorie?: EnumCategorieInscriptionFieldUpdateOperationsInput | $Enums.CategorieInscription
    nombreInvites?: IntFieldUpdateOperationsInput | number
    montantTotal?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    ticketCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrToken?: NullableStringFieldUpdateOperationsInput | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilletTombolaUpdateWithoutUserInput = {
    numeroBillet?: StringFieldUpdateOperationsInput | string
    quantite?: IntFieldUpdateOperationsInput | number
    montant?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilletTombolaUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    numeroBillet?: StringFieldUpdateOperationsInput | string
    quantite?: IntFieldUpdateOperationsInput | number
    montant?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilletTombolaUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    numeroBillet?: StringFieldUpdateOperationsInput | string
    quantite?: IntFieldUpdateOperationsInput | number
    montant?: IntFieldUpdateOperationsInput | number
    statutPaiement?: EnumStatutPaiementFieldUpdateOperationsInput | $Enums.StatutPaiement
    referencePaiement?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventSettingDefaultArgs instead
     */
    export type EventSettingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventSettingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PasswordResetDefaultArgs instead
     */
    export type PasswordResetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PasswordResetDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InscriptionGalaDefaultArgs instead
     */
    export type InscriptionGalaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InscriptionGalaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BilletTombolaDefaultArgs instead
     */
    export type BilletTombolaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BilletTombolaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ContactMessageDefaultArgs instead
     */
    export type ContactMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ContactMessageDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}