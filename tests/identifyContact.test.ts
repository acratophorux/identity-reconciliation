import { Repository } from "typeorm";
import { Contact } from "../src/entities/contact.entity";
import { identifyContact } from "../src/services/identify.service";
import { AppTestDataSource } from "./test-data-source";

let repo: Repository<Contact>;

beforeAll(async () => {
  await AppTestDataSource.initialize();
  repo = AppTestDataSource.getRepository(Contact);
});

afterEach(async () => {
  await repo.clear();
});

afterAll(async () => {
  await AppTestDataSource.destroy();
});

describe("identifyContact", () => {
  it("creates a primary contact when no match exists", async () => {
    const result = await identifyContact(repo, { email: "a@example.com", phoneNumber: "12345" });
    expect(result.contact.emails).toContain("a@example.com");
    expect(result.contact.phoneNumbers).toContain("12345");
    expect(result.contact.secondaryContactIds.length).toBe(0);
  });

  it("returns existing contact if email already exists", async () => {
    await repo.save(repo.create({ email: "a@example.com", phoneNumber: "12345", linkPrecedence: "primary" }));
    const result = await identifyContact(repo, { email: "a@example.com" });
    expect(result.contact.emails).toContain("a@example.com");
    expect(result.contact.secondaryContactIds.length).toBe(0);
  });

  it("returns existing contact if phone already exists", async () => {
    await repo.save(repo.create({ email: "a@example.com", phoneNumber: "12345", linkPrecedence: "primary" }));
    const result = await identifyContact(repo, { phoneNumber: "12345" });
    expect(result.contact.phoneNumbers).toContain("12345");
  });

  it("adds missing email to existing contact with matching phone", async () => {
    await repo.save(repo.create({ phoneNumber: "12345", linkPrecedence: "primary" }));
    const result = await identifyContact(repo, { phoneNumber: "12345", email: "b@example.com" });
    expect(result.contact.emails).toContain("b@example.com");
  });

  it("adds missing phone to existing contact with matching email", async () => {
    await repo.save(repo.create({ email: "a@example.com", linkPrecedence: "primary" }));
    const result = await identifyContact(repo, { email: "a@example.com", phoneNumber: "12345" });
    expect(result.contact.phoneNumbers).toContain("12345");
  });

  it("creates a secondary contact when linking to existing primary", async () => {
    await repo.save(repo.create({ email: "a@example.com", phoneNumber: "12345", linkPrecedence: "primary" }));
    const result = await identifyContact(repo, { email: "a@example.com", phoneNumber: "67890" });
    expect(result.contact.secondaryContactIds.length).toBe(1);
    expect(result.contact.phoneNumbers).toContain("67890");
  });

  it("merges two primaries by demoting the newer one", async () => {
    const primary1 = await repo.save(repo.create({
      email: "a@example.com", phoneNumber: "11111", linkPrecedence: "primary", createdAt: new Date()
    }));

    const primary2 = await repo.save(repo.create({
      email: "b@example.com", phoneNumber: "22222", linkPrecedence: "primary", createdAt: new Date(Date.now() + 1000)
    }));

    const result = await identifyContact(repo, { email: "a@example.com", phoneNumber: "22222" });
    expect(result.contact.primaryContactId).toBe(primary1.id);
    expect(result.contact.secondaryContactIds).toContain(primary2.id);
  });

  test("does not create duplicate contact on repeated input", async () => {
    await repo.save(repo.create({ email: "x@x.com", phoneNumber: "123", linkPrecedence: "primary" }));
    const result1 = await identifyContact(repo, { email: "x@x.com", phoneNumber: "123" });
    const result2 = await identifyContact(repo, { email: "x@x.com", phoneNumber: "123" });
    expect(result2.contact.secondaryContactIds.length).toBe(result1.contact.secondaryContactIds.length);
  });

  it("throws error when neither email nor phone is provided", async () => {
    await expect(identifyContact(repo, {})).rejects.toThrow("At least one of email or phoneNumber must be provided.");
  });
});