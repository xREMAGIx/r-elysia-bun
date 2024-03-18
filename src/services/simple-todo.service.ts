import { db } from "@/config/database";
import { simpleTodoTable } from "@/db-schema";
import { eq, sql } from "drizzle-orm";

interface QueryPaginationParams {
  sortBy: string;
  limit: number;
  page: number;
}

interface GetDetailParams {
  id: number;
}

interface CreateParams {
  name: string;
  isCompleted: boolean;
}

interface UpdateParams extends CreateParams {
  id: number;
}

export default abstract class SimpleTodoService {
  static async getList(params: QueryPaginationParams) {
    const { sortBy, limit, page } = params;

    const simpleTodoList = await db.query.simpleTodoTable.findMany({
      limit: limit,
      offset: limit * (page - 1),
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

  static async getDetail(params: GetDetailParams) {
    const { id } = params;

    return await db.query.simpleTodoTable.findFirst({
      where: eq(simpleTodoTable.id, id),
    });
  }

  static async create(params: CreateParams) {
    const { name, isCompleted } = params;

    const results = await db
      .insert(simpleTodoTable)
      .values({
        name: name,
        isCompleted: isCompleted,
      })
      .returning();

    return results[0];
  }

  static async update(params: UpdateParams) {
    const { id, name, isCompleted } = params;

    const results = await db
      .update(simpleTodoTable)
      .set({
        name: name,
        isCompleted: isCompleted,
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

    return results[0]
  }
}
