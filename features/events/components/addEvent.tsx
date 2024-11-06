"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useFormik } from "formik";

export default function AddNewEvent() {
  const formik = useFormik({
    initialValues: {
      logo: null,
      name: "",
      title: "",
      organizationUnit: "",
      description: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      formik.setFieldValue("logo", URL.createObjectURL(file));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="logo" className="block mb-2">
              Event Logo
            </Label>
            <div className="flex items-center justify-center">
              <Label
                htmlFor="logo"
                className="cursor-pointer flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 border-dashed hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {formik.values.logo ? (
                  <Image
                    src={formik.values.logo}
                    alt="Event logo"
                    className="w-full h-full object-cover rounded-full"
                    layout="fill"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload event logo"
                />
              </Label>
            </div>
          </div>
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="Enter event name"
              required
            />
          </div>
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Enter event title"
              required
            />
          </div>
          <div>
            <Label htmlFor="organizationUnit">Organization Unit</Label>
            <Select
              name="organizationUnit"
              value={formik.values.organizationUnit}
              onValueChange={formik.handleChange}
            >
              <SelectTrigger id="organizationUnit">
                <SelectValue placeholder="Select organization unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unit1">Unit 1</SelectItem>
                <SelectItem value="unit2">Unit 2</SelectItem>
                <SelectItem value="unit3">Unit 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Enter a brief description of the event"
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full">
            Add Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
