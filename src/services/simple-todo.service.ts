import { db } from "@/config/database";
import { simpleTodoTable } from "@/db-schema";
import { QueryPaginationParams } from "@/models/base";
import {
  CreateSimpleTodoParams,
  GetDetailSimpleTodoParams,
  UpdateSimpleTodoParams,
} from "@/models/simple-todo.model";
import { asc, desc, eq, sql } from "drizzle-orm";

export default abstract class SimpleTodoService {
  static async getList(params: QueryPaginationParams) {
    const { sortBy, limit = 10, page = 1 } = params;

    const simpleTodoList = await db.query.simpleTodoTable.findMany({
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortBy === "asc"
          ? [asc(simpleTodoTable.createdAt)]
          : [desc(simpleTodoTable.createdAt)],
    });

    const totalQueryResult = await db.execute(sql<{ count: string }>`
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

  static async getDetail(params: GetDetailSimpleTodoParams) {
    const { id } = params;

    return await db.query.simpleTodoTable.findFirst({
      where: eq(simpleTodoTable.id, id),
    });
  }

  static async create(params: CreateSimpleTodoParams) {
    const results = await db.insert(simpleTodoTable).values(params).returning();

    return results[0];
  }

  static async update(params: UpdateSimpleTodoParams) {
    const { id, ...rest } = params;

    const results = await db
      .update(simpleTodoTable)
      .set({
        ...rest,
      })
      .where(eq(simpleTodoTable.id, id))
      .returning();

    return results[0];
  }

  static async delete(id: number) {
    const results = await db
      .delete(simpleTodoTable)
      .where(eq(simpleTodoTable.id, id))
      .returning({ id: simpleTodoTable.id });

    return results[0];
  }
}
