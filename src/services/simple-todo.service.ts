import { DBType } from "@/config/database";
import { simpleTodoTable } from "@/db-schema";
import { QueryPaginationParams } from "@/models/base";
import {
  CreateSimpleTodoParams,
  GetDetailSimpleTodoParams,
  UpdateSimpleTodoParams,
} from "@/models/simple-todo.model";
import { asc, desc, eq, sql } from "drizzle-orm";

export default class SimpleTodoService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getList(params: QueryPaginationParams) {
    const { sortBy, limit = 10, page = 1 } = params;

    const simpleTodoList = await this.db.query.simpleTodoTable.findMany({
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortBy === "asc"
          ? [asc(simpleTodoTable.createdAt)]
          : [desc(simpleTodoTable.createdAt)],
    });

    const totalQueryResult = await this.db.execute(sql<{ count: string }>`
        SELECT count(*) FROM ${simpleTodoTable};
    `);
    const total = Number(totalQueryResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    return {
      data: simpleTodoList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getDetail(params: GetDetailSimpleTodoParams) {
    const { id } = params;

    return await this.db.query.simpleTodoTable.findFirst({
      where: eq(simpleTodoTable.id, id),
    });
  }

  async create(params: CreateSimpleTodoParams) {
    const results = await this.db
      .insert(simpleTodoTable)
      .values(params)
      .returning();

    return results[0];
  }

  async update(params: UpdateSimpleTodoParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(simpleTodoTable)
      .set({
        ...rest,
      })
      .where(eq(simpleTodoTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(simpleTodoTable)
      .where(eq(simpleTodoTable.id, id))
      .returning({ id: simpleTodoTable.id });

    return results[0];
  }
}
