import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { useEffect, useState } from "react"
import useBookingStore from "../../stores/useBookingStore"
import { useNavigate } from "react-router"
//import { toast } from "sonner"

type CancelBookingProps = {
  cancel: boolean
  id: string | null
}

const CancelBooking = ({ cancel,id }: CancelBookingProps) => {
  const [open, setOpen] = useState(false)
  const deleteBooking = useBookingStore((state: any) => state.deleteBooking)
  const navigate = useNavigate()

  // Sync dialog open state with prop
  useEffect(() => {
    setOpen(cancel)
  }, [cancel])

  const handleConfirm = () => {
    deleteBooking(id as string)
    //toast.success("Booking cancelled successfully.")
    navigate(0) // Refresh the page
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={handleClose}>
            No, Keep Booking
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Yes, Cancel Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CancelBooking
