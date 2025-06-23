"use client";

import { useState, useEffect } from "react";
import { useUsers, UserFilter } from "@/lib/api/users.Fn";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Search, X, UserPlus } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { UserSkeleton } from "./UserSkeleton";
import { UserTable } from "./UserTable";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 10;

export function UsersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilter>({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  // Search form state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get users data with filters
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers(filters);

  // Apply filters automatically when search term or role filter changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1, // Reset to first page when filters change
      search: debouncedSearchTerm,
      role: roleFilter === "all" ? undefined : (roleFilter as Role),
    }));
  }, [debouncedSearchTerm, roleFilter]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  // Handle edit user
  const handleEditUser = (userId: string) => {
    setEditUserId(userId);
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    setDeleteUserId(userId);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="border-none px-0 mx-0 shadow-none">
        <CardContent className="px-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-2">
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as Role | "all")}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={Role.admin}>Admin</SelectItem>
                  <SelectItem value={Role.content}>Content</SelectItem>
                  <SelectItem value={Role.user}>User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="button" variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}

      {isLoading ? (
        <UserSkeleton />
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-destructive">
            Error loading users: {(error as Error)?.message || "Unknown error"}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : userData?.users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/20">
          <div className="flex flex-col items-center text-center max-w-md">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>

            <p className="text-muted-foreground mb-6">
              {filters.search && filters.role ? (
                <>
                  No users matching &quot;<strong>{filters.search}</strong>
                  &quot; with role <strong>{filters.role}</strong> were found.
                </>
              ) : filters.search ? (
                <>
                  No users matching &quot;<strong>{filters.search}</strong>
                  &quot; were found.
                </>
              ) : filters.role ? (
                <>
                  No users with role <strong>{filters.role}</strong> were found.
                </>
              ) : (
                <>
                  There are no users in the system. Create a new user to get
                  started.
                </>
              )}
            </p>

            <div className="flex gap-3">
              {(filters.search || filters.role) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}

              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add New User
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <UserTable
            users={userData?.users || []}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />

          {userData && userData.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                page={filters.page || 1}
                pageCount={userData.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Add User Dialog */}
      <AddUserDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {/* Edit User Dialog */}
      {editUserId && (
        <EditUserDialog
          userId={editUserId}
          open={!!editUserId}
          onOpenChange={(open) => !open && setEditUserId(null)}
        />
      )}

      {/* Delete User Dialog */}
      {deleteUserId && (
        <DeleteUserDialog
          userId={deleteUserId}
          open={!!deleteUserId}
          onOpenChange={(open) => !open && setDeleteUserId(null)}
        />
      )}
    </div>
  );
}
