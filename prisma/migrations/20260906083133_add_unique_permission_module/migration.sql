/*
  Warnings:

  - A unique constraint covering the columns `[workSpaceId,permission]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_workSpaceId_permission_key" ON "Permission"("workSpaceId", "permission");
