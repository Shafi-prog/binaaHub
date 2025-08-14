import React from 'react'
import {
  Activity,
  AlertCircle,
  ArrowDownNarrowWide,
  ArrowLeft,
  ArrowRight,
  ArrowUpCircle,
  ArrowUpDown,
  BookOpen as LucideBookOpen,
  Building,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Files,
  GripVertical,
  Handshake,
  Image,
  Link as LinkIcon,
  Loader2,
  Mail,
  Minus,
  MoreHorizontal,
  MoveDiagonal,
  Package,
  PanelLeft,
  Percent,
  PieChart,
  Plus as LucidePlus,
  Puzzle,
  RefreshCw,
  Search,
  Settings2,
  Share2,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  SquareArrowOutUpRight,
  TrendingUp,
  Truck,
  User,
  UserPlus,
  Users,
  X,
  XCircle,
} from 'lucide-react'

type IconProps = React.ComponentProps<'svg'> & { className?: string }

const wrap = (C: React.FC<IconProps>) => (props: IconProps) => <C {...props} />

// Common mappings
export const BookOpen = wrap(LucideBookOpen)
export const CircleHalfSolid = wrap(Circle)
export const EllipsisHorizontal = wrap(MoreHorizontal)
export const Keyboard = wrap(MoreHorizontal)
export const OpenRectArrowOut = wrap(SquareArrowOutUpRight)
export const TimelineVertical = wrap(ChevronsUpDown)
export const UserIcon = wrap(User)
export const XMark = wrap(X)

// Status/info icons
export const InformationCircle = wrap(AlertCircle)
export const InformationCircleSolid = wrap(AlertCircle)
export const ExclamationCircle = wrap(AlertCircle)
export const ExclamationCircleSolid = wrap(AlertCircle)
export const CheckCircleSolid = wrap(CheckCircle)

// Editing/CRUD
export const PencilSquare = wrap(Puzzle)
export const Trash = wrap(X)
export const Plus = wrap(LucidePlus)
export const PlusMini = wrap(LucidePlus)
export const MinusMini = wrap(Minus)

// Commerce
export const Bag = wrap(ShoppingBag)
export const ShoppingCartIcon = wrap(ShoppingCart)
export const DollarSignIcon = wrap(DollarSign)
export const Store = wrap(Building)

// Media/thumbnail
export const ThumbnailBadge = wrap(Image)
export const Photo = wrap(Image)

// Navigation/arrows
export const ArrowUturnLeft = wrap(ArrowLeft)
export const ArrowUpDownIcon = wrap(ArrowUpDown)
export const ArrowUpCircleSolid = wrap(ArrowUpCircle)
export const ArrowDownTray = wrap(Download)
export const ArrowUpRightOnBox = wrap(ExternalLink)
export const ArrowRightIcon = wrap(ArrowRight)
export const ArrowPathMini = wrap(RefreshCw)

// Sorting/triangles
export const TriangleDownMini = wrap(ChevronDown)
export const TriangleRightMini = wrap(ChevronRight)
export const TrianglesMini = wrap(ChevronsUpDown)
export const DescendingSorting = wrap(ArrowDownNarrowWide)

// Misc controls
export const CircleSliders = wrap(SlidersHorizontal)
export const ArrowsPointingOut = wrap(MoveDiagonal)
export const SidebarLeft = wrap(PanelLeft)
export const DotsSix = wrap(GripVertical)
export const Spinner = (props: IconProps) => <Loader2 {...props} className={['animate-spin', props.className].filter(Boolean).join(' ')} />
export const SquareTwoStack = wrap(Copy)
export const Link = wrap(LinkIcon)

// Business/objects
export const Buildings = wrap(Building)
export const HandTruck = wrap(Truck)
export const Component = wrap(Puzzle)
export const Channels = wrap(Share2)
export const ChartPie = wrap(PieChart)
export const CurrencyDollar = wrap(DollarSign)
export const TaxExclusive = wrap(Percent)
export const TaxInclusive = wrap(Percent)
export const DocumentText = wrap(FileText)
export const DocumentSeries = wrap(Files)
export const HeartBroken = wrap(Handshake)

// People
export { Users, UserPlus, User, Eye as EyeIcon, EyeOff }

// Analytics
export { Package, TrendingUp, Activity }

// Payment/communication
export const Envelope = wrap(Mail)

// Fallbacks for any unmapped names that might be referenced
export const XMarkMini = wrap(X)
export const XCircleIcon = wrap(XCircle)

// Temporary shim for any missing icons (avoid TS errors if imported)
export const UnknownIcon: React.FC<IconProps> = (props) => <Circle {...props} />
