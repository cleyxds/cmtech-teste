import { Button } from './button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'
import { AlertTriangle } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="mt-4">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={onCancel || (() => onOpenChange(false))}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}