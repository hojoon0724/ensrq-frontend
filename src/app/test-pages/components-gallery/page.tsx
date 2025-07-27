"use client";
import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  Icon,
  Image,
  InputField,
  Label,
  Link,
  RadioButton,
  SelectDropdown,
  Spinner,
  Textarea,
  Tooltip,
} from "../../../components/atoms";

export default function ComponentsGalleryPage() {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("");

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "disabled", label: "Disabled Option", disabled: true },
  ];

  return (
    <div className="components-gallery-page p-8 max-w-6xl mx-auto">
      <div className="page-title mb-8">
        <h1>Components Gallery</h1>
        <p>Atomic Design System Components</p>
      </div>

      {/* Atoms Section */}
      <div className="component-hierarchy mb-12">
        <h2 className="mb-6">Atoms</h2>

        {/* Typography */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Typography</h3>
          <div className="grid gap-4">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>

            <div>
              <p>This is a paragraph with normal text.</p>
              <p>This is a paragraph with normal text.</p>
              <p>This is muted paragraph text.</p>
              <p>This is small text.</p>
            </div>
            <div className="flex gap-4">
              <div>Light</div>
              <div>Normal</div>
              <div>Medium</div>
              <div>Semibold</div>
              <div>Bold</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Buttons</h3>
          <div className="grid gap-4">
            <div className="flex gap-4 flex-wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
            <div className="flex gap-4">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Input Fields</h3>
          <div className="grid gap-4 max-w-md">
            <div>
              <Label htmlFor="default-input">Default Input</Label>
              <InputField
                id="default-input"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                fullWidth
              />
            </div>
            <div>
              <Label htmlFor="error-input" variant="required">
                Error Input
              </Label>
              <InputField id="error-input" variant="error" placeholder="Error state" fullWidth />
            </div>
            <div>
              <Label htmlFor="success-input">Success Input</Label>
              <InputField id="success-input" variant="success" placeholder="Success state" fullWidth />
            </div>
            <div className="flex gap-2">
              <InputField inputSize="sm" placeholder="Small" />
              <InputField inputSize="md" placeholder="Medium" />
              <InputField inputSize="lg" placeholder="Large" />
            </div>
          </div>
        </div>

        {/* Checkboxes and Radio Buttons */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Checkboxes & Radio Buttons</h3>
          <div className="grid gap-6">
            <div>
              <h6 className="mb-2">Checkboxes</h6>
              <div className="flex gap-4 flex-wrap">
                <Checkbox
                  label="Default Checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <Checkbox label="Success Checkbox" variant="success" />
                <Checkbox label="Danger Checkbox" variant="danger" />
                <Checkbox label="Disabled" disabled />
              </div>
            </div>
            <div>
              <h6 className="mb-2">Radio Buttons</h6>
              <div className="flex gap-4 flex-wrap">
                <RadioButton
                  name="radio-group"
                  label="Option 1"
                  value="option1"
                  checked={selectedRadio === "option1"}
                  onChange={(e) => setSelectedRadio(e.target.value)}
                />
                <RadioButton
                  name="radio-group"
                  label="Option 2"
                  value="option2"
                  checked={selectedRadio === "option2"}
                  onChange={(e) => setSelectedRadio(e.target.value)}
                />
                <RadioButton name="radio-group" label="Disabled" value="disabled" disabled />
              </div>
            </div>
          </div>
        </div>

        {/* Icons */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Icons</h3>
          <div className="grid gap-4">
            <div className="flex gap-4 items-center flex-wrap">
              <Icon name="check" />
              <Icon name="x" />
              <Icon name="chevronDown" />
              <Icon name="chevronUp" />
              <Icon name="search" />
              <Icon name="heart" />
              <Icon name="star" />
              <Icon name="info" />
              <Icon name="warning" />
              <Icon name="error" />
            </div>
            <div className="flex gap-4 items-center">
              <Icon name="check" size="xs" />
              <Icon name="check" size="sm" />
              <Icon name="check" size="md" />
              <Icon name="check" size="lg" />
              <Icon name="check" size="xl" />
            </div>
            <div className="flex gap-4 items-center">
              <Icon name="heart" color="red" />
              <Icon name="star" color="gold" />
              <Icon name="check" color="green" />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Links</h3>
          <div className="grid gap-4">
            <div className="flex gap-4 flex-wrap">
              <Link href="#">Default Link</Link>
              <Link href="#" variant="primary">
                Primary Link
              </Link>
              <Link href="#" variant="secondary">
                Secondary Link
              </Link>
              <Link href="#" variant="danger">
                Danger Link
              </Link>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link href="#" underline="none">
                No Underline
              </Link>
              <Link href="#" underline="hover">
                Hover Underline
              </Link>
              <Link href="#" underline="always">
                Always Underline
              </Link>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link href="#" size="sm">
                Small Link
              </Link>
              <Link href="#" size="md">
                Medium Link
              </Link>
              <Link href="#" size="lg">
                Large Link
              </Link>
            </div>
          </div>
        </div>

        {/* Select Dropdown */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Select Dropdown</h3>
          <div className="grid gap-4 max-w-md">
            <div>
              <Label htmlFor="select-default">Default Select</Label>
              <SelectDropdown
                id="select-default"
                options={selectOptions}
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                fullWidth
              />
            </div>
            <div className="flex gap-2">
              <SelectDropdown options={selectOptions} inputSize="sm" placeholder="Small" />
              <SelectDropdown options={selectOptions} inputSize="md" placeholder="Medium" />
              <SelectDropdown options={selectOptions} inputSize="lg" placeholder="Large" />
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Textarea</h3>
          <div className="grid gap-4 max-w-md">
            <div>
              <Label htmlFor="textarea-default">Default Textarea</Label>
              <Textarea
                id="textarea-default"
                placeholder="Enter your message..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={4}
                fullWidth
              />
            </div>
            <div>
              <Label htmlFor="textarea-error">Error Textarea</Label>
              <Textarea id="textarea-error" variant="error" placeholder="Error state" rows={3} fullWidth />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Badges</h3>
          <div className="grid gap-4">
            <div className="flex gap-2 flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Badge size="xs">XSmall</Badge>
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge shape="rounded">Rounded</Badge>
              <Badge shape="pill">Pill</Badge>
              <Badge shape="square">Square</Badge>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge dot variant="success">
                Online
              </Badge>
              <Badge dot variant="warning">
                Away
              </Badge>
              <Badge dot variant="danger">
                Offline
              </Badge>
            </div>
          </div>
        </div>

        {/* Spinners */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Spinners</h3>
          <div className="grid gap-4">
            <div className="flex gap-4 items-center flex-wrap">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>
            <div className="flex gap-4 items-center">
              <Spinner variant="circular" />
              <Spinner variant="dots" />
              <Spinner variant="pulse" />
            </div>
            <div className="flex gap-4 items-center">
              <Spinner color="primary" />
              <Spinner color="success" />
              <Spinner color="warning" />
              <Spinner color="danger" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Images</h3>
          <div className="grid gap-4">
            <div className="flex gap-4 items-center flex-wrap">
              <Image src="/next.svg" alt="Next.js Logo" width={120} height={30} rounded="none" />
              <Image src="/vercel.svg" alt="Vercel Logo" width={100} height={24} rounded="sm" />
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 relative">
                <Image src="/next.svg" alt="Square image" width={64} height={64} rounded="md" objectFit="contain" />
              </div>
              <div className="w-16 h-16 relative">
                <Image
                  src="/vercel.svg"
                  alt="Rounded image"
                  width={64}
                  height={64}
                  rounded="full"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dividers */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Dividers</h3>
          <div className="grid gap-6">
            <div>
              <div className="mb-2 text-sm">Horizontal Dividers</div>
              <Divider />
              <Divider variant="dashed" />
              <Divider variant="dotted" />
            </div>
            <div>
              <div className="mb-2 text-sm">Colors & Thickness</div>
              <Divider color="light" />
              <Divider color="default" thickness="medium" />
              <Divider color="primary" thickness="thick" />
            </div>
          </div>
        </div>

        {/* Tooltips */}
        <div className="component-showcase mb-8 p-6 border rounded-lg">
          <h3 className="mb-4">Tooltips</h3>
          <div className="flex gap-4 flex-wrap">
            <Tooltip content="This is a tooltip on top" position="top">
              <Button variant="outline">Top Tooltip</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on bottom" position="bottom">
              <Button variant="outline">Bottom Tooltip</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on left" position="left">
              <Button variant="outline">Left Tooltip</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on right" position="right">
              <Button variant="outline">Right Tooltip</Button>
            </Tooltip>
            <Tooltip content="Light tooltip" variant="light">
              <Button variant="outline">Light Tooltip</Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Molecules and Organisms placeholders */}
      <div className="component-hierarchy mb-8">
        <h2 className="mb-4">Molecules</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>

      <div className="component-hierarchy">
        <h2 className="mb-4">Organisms</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}
