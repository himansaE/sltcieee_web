"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import type { Author } from "@prisma/client";

async function createAuthor(newAuthor: {
  name: string;
  bio: string;
}): Promise<Author> {
  const response = await fetch("/api/admin/authors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAuthor),
  });
  if (!response.ok) {
    throw new Error("Failed to create author");
  }
  return response.json();
}

export function AddAuthorDialog({
  onSuccess,
}: {
  onSuccess: (newAuthor: Author) => void;
}) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: createAuthor,
    onSuccess: (newAuthor) => {
      toast.success("Author created successfully");
      onSuccess(newAuthor);
      setIsOpen(false);
      setName("");
      setBio("");
    },
    onError: () => {
      toast.error("Failed to create author");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, bio });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Author
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Author</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="bio">Bio</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner /> : "Add Author"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
