import { RefinementCtx, string, z } from "zod";

describe("Validation", () => {
  it("should should support validation", async () => {
    const schema = z.string().min(3).max(10);

    const request = "farhan";

    const result = schema.parse(request);
    console.info(result);
    expect(result).toBe("farhan");
  });
  it("should support validation", () => {
    const usernameSchema = z.string().email();
    const isAdminSchema = z.boolean();
    const priceSchema = z.number().min(1000).max(1000000);

    const username = usernameSchema.parse("farhan@example.com");
    console.info(username);
    const isAdmin = isAdminSchema.parse(true);
    console.info(isAdmin);
    const price = priceSchema.parse(10000);
    console.info(price);
  });
  it("should support data conversion", () => {
    const usernameSchema = z.coerce.string();
    const isAdminSchema = z.coerce.boolean();
    const priceSchema = z.coerce.number().min(1000).max(1000000);

    const username = usernameSchema.parse(1234);
    console.info(username);
    const isAdmin = isAdminSchema.parse("true");
    console.info(isAdmin);
    const price = priceSchema.parse("10000");
    console.info(price);
  });

  it("should support date", () => {
    const birthDateSchema = z.coerce
      .date()
      .min(new Date(1980, 0, 1))
      .max(new Date(2020, 0, 1));

    const birthDate = birthDateSchema.parse("1990-01-1");
    console.info(birthDate);
    const birthDate2 = birthDateSchema.parse(new Date(1990, 0, 1));
    console.info(birthDate2);
  });

  it("should give error message", () => {
    const userSchema = z.string().email().min(3).max(100);

    try {
      userSchema.parse("farhan@example.com");
    } catch (error) {
      console.error(error);
    }
  });

  it("should pass the object", () => {
    const dataSchema = z.object({
      name: z.string().min(3).max(100),
      email: z.string().email().min(3).max(100),
    });

    const request = {
      name: "farhan",
      email: "farhan@example.com",
    };

    const result = dataSchema.parse(request);
    console.info(result);
  });

  it("should valid for nested object", () => {
    const dataSchema = z.object({
      name: z.string().min(3).max(100),
      email: z.string().email().min(3).max(100),
      address: z.object({
        country: z.string().min(2),
        city: z.string().min(2),
      }),
    });

    const request = {
      name: "farhan",
      email: "farhan@example.com",
      address: {
        country: "Indonesia",
        city: "Jakarta",
      },
    };
    const result = dataSchema.parse(request);
    console.info(result);
  });

  it("should support array", () => {
    const arraySchema = z.array(z.string()).min(1).max(5);

    const request: Array<string> = ["farhan", "ramadan"];

    const result = arraySchema.parse(request);
    console.info(result);
  });

  it("should support set", () => {
    const setSchema = z.set(z.string()).min(1).max(5);

    const request: Set<string> = new Set(["farhan", "ramadan"]);

    const result = setSchema.parse(request);
    console.info(result);
  });

  it("should support map", () => {
    const mapSchema = z.map(z.string(), z.string().email());

    const request: Map<string, string> = new Map([
      ["farhan", "farhan@example.com"],
      ["ramadan", "ramadan@example.com"],
    ]);

    const result = mapSchema.parse(request);
    console.info(result);
  });

  it("should pass the object with message", () => {
    const dataSchema = z.object({
      name: z.string().min(3, "min 3 character").max(100),
      email: z.string().email("harus berupa email").min(3).max(100),
    });

    const request = {
      name: "farhan",
      email: "farhan@example.com",
    };

    const result = dataSchema.parse(request);
    console.info(result);
  });
  it("should valid for optional object", () => {
    const objectShema = z.object({
      firstName: z.string().min(3).max(100),
      lastName: z.string().min(3).max(100).optional(),
      email: z.string().email().min(3).max(100),
    });

    const request = {
      firstName: "farhan",
      //   lastName: "ramadan",
      email: "farhan@example.com",
    };
    const result = objectShema.parse(request);
    console.info(result);
  });

  it("should support transform data", () => {
    const schema = z.string().transform((data) => {
      return data.toUpperCase().trim();
    });

    const result = schema.parse("      farhan");
    expect(result).toBe("FARHAN");
    console.info(result);
  });

  function mustUpperCase(data: string, ctx: RefinementCtx): string {
    if (data != data.toUpperCase()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "username harus uppercase",
      });
      return z.NEVER;
    } else {
      return data;
    }
  }
  it("should support transform data with custom validation", async () => {
    const schema = z.object({
      username: z.string().transform(mustUpperCase),
      password: z.string().min(3).max(100),
    });

    const request = {
      username: "FARHAN",
      password: "rahasia",
    };

    const result = schema.parse(request);
    console.info(result);
  });
});
