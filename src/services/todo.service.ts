import { db } from "@/config/database";
import { todoTable } from "@/db-schema";
import { QueryPaginationParams } from "@/models/base";
import {
  CreateTodoParams,
  GetDetailTodoParams,
  UpdateTodoParams,
} from "@/models/todo.model";
import { asc, desc, eq, sql } from "drizzle-orm";

export default abstract class SimpleTodoService {
  static async getList(params: QueryPaginationParams) {
    const { sortBy, limit = 10, page = 1 } = params;

    const simpleTodoList = await db.query.todoTable.findMany({
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortBy === "asc"
          ? [asc(todoTable.createdAt)]
          : [desc(todoTable.createdAt)],
    });

    const totalQueryResult = await db.execute(sql<{ count: string }>`
        SELECT count(*) FROM ${todoTable};
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

  static async getDetail(params: GetDetailTodoParams) {
    const { id } = params;

    return await db.query.todoTable.findFirst({
      where: eq(todoTable.id, id),
    });
  }

  static async create(params: CreateTodoParams) {
    const results = await db.insert(todoTable).values(params).returning();

    return results[0];
  }

  static async update(params: UpdateTodoParams) {
    const { id, ...rest } = params;

    const results = await db
      .update(todoTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(todoTable.id, id))
      .returning();

    return results[0];
  }

  static async delete(id: number) {
    const results = await db
      .delete(todoTable)
      .where(eq(todoTable.id, id))
      .returning({ id: todoTable.id });

    return results[0];
  }
}
