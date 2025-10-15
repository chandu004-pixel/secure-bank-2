"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { kycStatus } from "@/lib/data";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const kycFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  dob: z.date({ required_error: "A date of birth is required." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  idType: z.enum(["passport", "drivers_license", "national_id"]),
  idNumber: z.string().min(5, { message: "ID number is too short." }),
  document: z.any().refine(files => files?.length == 1, "ID Document is required."),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

export default function KycPage() {
  const { toast } = useToast();
  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
  });
  const fileRef = form.register("document");

  function onSubmit(data: KycFormValues) {
    console.log(data);
    toast({
      title: "KYC Submitted",
      description: "Your KYC information has been submitted for review.",
    });
    form.reset();
  }
  
  const kycVariant = {
    approved: "default",
    pending: "secondary",
    rejected: "destructive",
    none: "outline",
  } as const;


  return (
    <Tabs defaultValue="status" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="status">View Status</TabsTrigger>
        <TabsTrigger value="submit">Submit/Update KYC</TabsTrigger>
      </TabsList>
      <TabsContent value="status">
        <Card>
          <CardHeader>
            <CardTitle>KYC Status</CardTitle>
            <CardDescription>
              Here is the current status of your KYC verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Status:</span>
              <Badge variant={kycVariant[kycStatus.status]} className="capitalize text-sm">
                {kycStatus.status}
              </Badge>
            </div>
            {kycStatus.status !== "none" && (
                <div className="border p-4 rounded-lg space-y-2 bg-muted/50">
                    <h3 className="font-semibold">Submitted Information</h3>
                    <p><strong>Full Name:</strong> {kycStatus.details.fullName}</p>
                    <p><strong>Date of Birth:</strong> {format(new Date(kycStatus.details.dob), "MMMM dd, yyyy")}</p>
                    <p><strong>Address:</strong> {kycStatus.details.address}</p>
                    <p><strong>ID Type:</strong> {kycStatus.details.idType}</p>
                    <p><strong>ID Number:</strong> {kycStatus.details.idNumber}</p>
                    <p><strong>Submitted On:</strong> {format(new Date(kycStatus.submittedAt), "MMMM dd, yyyy")}</p>
                </div>
            )}
            {kycStatus.status === "none" && (
                <p className="text-muted-foreground">You have not submitted any KYC documents yet. Please go to the 'Submit/Update KYC' tab.</p>
            )}
             {kycStatus.status === "rejected" && (
                <p className="text-destructive">Your KYC was rejected. Please resubmit with correct information.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="submit">
        <Card>
          <CardHeader>
            <CardTitle>Submit KYC</CardTitle>
            <CardDescription>
              Please fill out the form below to submit your KYC documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="A1B2C3D4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <FormField
                  control={form.control}
                  name="document"
                  render={() => (
                    <FormItem>
                      <FormLabel>ID Document Upload</FormLabel>
                      <FormControl>
                         <Input type="file" {...fileRef} />
                      </FormControl>
                      <FormDescription>Please upload a clear scan of your ID document.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Submit for Review</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
