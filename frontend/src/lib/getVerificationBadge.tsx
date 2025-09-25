import { Badge } from "@/components/ui/badge";

const getVerificationBadge = (verified?: 'pending' | 'verified' | 'fake') => {
  switch (verified) {
    case 'verified':
      return <Badge className="bg-green-500 text-white">Verified</Badge>;
    case 'fake':
      return <Badge className="bg-red-500 text-white">Fake News</Badge>;
    default:
      return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
  }
};

export default getVerificationBadge;