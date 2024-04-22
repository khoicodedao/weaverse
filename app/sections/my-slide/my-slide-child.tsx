import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseImage,
} from '@weaverse/hydrogen';
import clsx from 'clsx';
import {forwardRef} from 'react';
import {Image} from '@shopify/hydrogen';
type MySlideChildData = {
  heading: string;
  source: WeaverseImage;
  description: string;
  buttonText: string;
  imageAspectRatio: string;
  buttonLink: string;
  textAnimation: boolean;
  headingColor: string;
};

type MySlideChildProps = HydrogenComponentProps<
  Awaited<ReturnType<typeof loader>>
> &
  MySlideChildData;

let MySlideChild = forwardRef<HTMLElement, MySlideChildProps>((props, ref) => {
  let {
    heading,
    source,
    description,
    buttonText,
    loaderData,
    imageAspectRatio,
    buttonLink,
    textAnimation,
    headingColor,
    ...rest
  } = props;
  return (
    <section ref={ref} {...rest}>
      <div className="relative min-h-600 bg-gray-100 transition-opacity duration-500">
        <div className="absolute inset-0">
          <Image
            data={source}
            alt={heading}
            className={`object-cover w-full h-full ${imageAspectRatio}`}
          />
        </div>
        <div
          className={clsx(
            'slide-content absolute inset-0 flex flex-col justify-center items-center text-center p-8 opacity-100',
            textAnimation ? 'animate-bounce' : '',
          )}
        >
          <h2
            style={{color: headingColor}}
            className={clsx('text-3xl font-bold mb-4 animate-fadeIn')}
          >
            {heading}
          </h2>
          <p className="text-lg">
            {' '}
            <div
              className="text-lg"
              dangerouslySetInnerHTML={{__html: description}}
            />
          </p>
          <div>
            <a
              className=" block py-3 px-4 rounded cursor-pointer mt-3 w-fit mx-auto transition btn-primary"
              href={`${buttonLink}`}
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

export let loader = async (args: ComponentLoaderArgs<MySlideChildData>) => {
  // Data fetching logic, the code will be run on the server-side ...
};

export let schema: HydrogenComponentSchema = {
  type: 'my-slide-child',
  title: 'My Slide Child',
  inspector: [
    {
      group: 'General',
      inputs: [
        {type: 'image', name: 'source', label: 'Slide image'},
        {
          type: 'text',
          label: 'Heading',
          name: 'heading',
          defaultValue: 'Heading',
          placeholder: 'Enter section heading',
        },
        {
          type: 'color',
          label: 'Heading Color',
          name: 'headingColor',
          defaultValue: '#FFFFFF',
        },
        {
          type: 'richtext',
          label: 'Description',
          name: 'description',
          defaultValue:
            "<p>We're excited to announce our <strong>limited-time</strong> savings event. From <em>October 15th to November 15th</em>, enjoy exclusive discounts and offers.</p>",
        },

        {
          type: 'switch',
          label: 'Text animation',
          name: 'textAnimation',
          defaultValue: false,
          helpText: 'Works if parallax is disabled',
        },
        {
          type: 'select',
          label: 'Image aspect ratio',
          name: 'imageAspectRatio',
          configs: {
            options: [
              {value: 'auto', label: 'Adapt to image'},
              {value: '1/1', label: '1/1'},
              {value: '3/4', label: '3/4'},
              {value: '4/3', label: '4/3'},
            ],
          },
          defaultValue: 'auto',
        },
        {
          type: 'text',
          label: 'Button Text',
          name: 'buttonText',
          defaultValue: 'Click here!',
        },
        {
          type: 'url',
          label: 'Button link',
          name: 'buttonLink',
          defaultValue: '/products',
        },
      ],
    },
  ],
};

export default MySlideChild;
