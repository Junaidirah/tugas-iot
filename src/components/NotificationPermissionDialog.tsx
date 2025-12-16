import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bell } from "lucide-react";

interface NotificationPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function NotificationPermissionDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: NotificationPermissionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card border-glass-border max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Enable Notifications?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            Get real-time alerts when air quality reaches warning or danger levels.
            We'll notify you to help keep your environment safe.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onCancel}
            className="glass-card border-glass-border hover:bg-glass/50"
          >
            Not now
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Enable notifications
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
